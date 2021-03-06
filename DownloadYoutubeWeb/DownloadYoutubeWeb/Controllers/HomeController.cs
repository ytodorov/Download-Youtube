﻿using DownloadYoutubeWeb.Infrastructure;
using DownloadYoutubeWeb.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using Telerik.Windows.Zip;
using VideoLibrary;

namespace DownloadYoutubeWeb.Controllers
{
    public class HomeController : BaseController
    {
        public const int MAX_RETRY_COUNT = 3;

        public ActionResult Index()
        {
            try
            {
                string queryString = Request.QueryString.ToString();
                string queryToAppend = string.Empty;
                if (!string.IsNullOrEmpty(queryString))
                {
                    queryString = $"?{queryString}";
                }
                                    
                if (Request.Url.ToString().IndexOf("/bg", StringComparison.InvariantCultureIgnoreCase) == -1)
                {
                    if (Request.Cookies["userSetLangugaTo"] == null)
                    {
                        if (!Request.IsLocal)
                        {
                            using (HttpClient client = new HttpClient())
                            {
                                client.Timeout = TimeSpan.FromSeconds(3);
                                var ip = Request.UserHostAddress;
                                var uriToGet = $"https://toolsfornet.com/iplocation/getipcountrycode?ip={ip}";
                                var twoLetterCountry = client.GetStringAsync(uriToGet).Result?.ToLowerInvariant();
                                if ("bg".Equals(twoLetterCountry, StringComparison.InvariantCultureIgnoreCase))
                                {
                                   

                                    Response.Redirect($"/bg{queryString}");
                                }
                            }
                        }
                        else
                        {
                            using (HttpClient client = new HttpClient())
                            {
                                client.Timeout = TimeSpan.FromSeconds(3);
                                var ip = "77.70.121.132";
                                var uriToGet = $"https://toolsfornet.com/iplocation/getipcountrycode?ip={ip}";
                                var twoLetterCountry = client.GetStringAsync(uriToGet).Result?.ToLowerInvariant();
                                if ("bg".Equals(twoLetterCountry, StringComparison.InvariantCultureIgnoreCase))
                                {
                                    Response.Redirect($"/bg{queryString}");
                                }
                            }
                        }
                    }
                    else
                    {
                        var setLanguage = Request.Cookies["userSetLangugaTo"].Value;
                        //if (setLanguage?.Equals("en"))
                        //{
                        //    Response.Redirect("/bg");
                        //}
                    }
                }
            }
            catch (Exception ex)
            {
                LoggingManager.Logger.Error(ex, ex.Message);
            }

            HomeViewModel hvm = new HomeViewModel();

            var qs = Request.Url.Query.ToString();
            string val = string.Empty;
            if (!string.IsNullOrEmpty(qs))
            {
                var ind = qs.IndexOf("q=");
                val = qs.Substring(3);
                val = Server.UrlDecode(val);
            }
   
            hvm.DefaultUrls = val;
            return View(hvm);
        }
            


        public ActionResult DownloadAudioStream(string guid)
        {
            ActionResult fs = MemoryCacheManager.Get(guid) as ActionResult;
            return fs;
        }

        public JsonResult IsStreamReady(string guid)
        {
            ActionResult fs = MemoryCacheManager.Get(guid) as ActionResult;
            if (fs != null)
            {
                return Json(true);
            }
            return Json(false);
        }

        public ActionResult DownloadAudio(string uri, string format, string formatcode,
            string resolution, string convertto, string guid, bool? leftclick)
        {            
            LoggingManager.Logger.Info($"Start DownloadAudio of {guid}");
            Task.Factory.StartNew(() =>
            {
                try
                {
                    var errorMessage = string.Empty;

                    for (int i = 0; i < MAX_RETRY_COUNT; i++)
                    {
                        try
                        {
                            YouTubeVideo video = GetVideo(uri, format, formatcode, resolution);
                            string unencodedUri = HttpUtility.UrlDecode(uri).DecodeBase64();

                            Uri uriObject = new Uri(unencodedUri);
                            var query = uriObject.Query; //?v=F_DE-sfyFj8&feature=youtu.be
                            string v = HttpUtility.ParseQueryString(uriObject.Query).Get("v");
                            unencodedUri = unencodedUri.Replace(query, string.Empty);
                            // Това е важно за да премахнем всякакви други querystring параметри - те създават проблеми
                            unencodedUri = $"{unencodedUri}?v={v}";

                            using (HttpClient client = new HttpClient())
                            {
                                client.BaseAddress = new Uri(Constants.VmSiteOneForDownloadYouTubeStream);

                                client.Timeout = TimeSpan.FromHours(1);
                                var postData = new MultipartFormDataContent();

                                string args = string.Empty;

                                if (video?.AdaptiveKind.ToString().IsCaseInsensitiveEqual("video") == true)
                                {

                                    // за да се избегне конвертирането в .mkv  Матрьошка
                                    string audioFormatCode = "bestaudio";

                                    if (video.FileExtension.ToLowerInvariant().Contains("mp4"))
                                    {
                                        audioFormatCode = "m4a";
                                    }
                                    else if (video.FileExtension.ToLowerInvariant().Contains("webm"))
                                    {
                                        audioFormatCode = "webm";
                                    }

                                    args = $" -f {formatcode}+{audioFormatCode} {unencodedUri}";
                                }
                                else
                                {
                                    // за аудио конвертиране
                                    //youtube-dl.exe -f bestaudio https://www.youtube.com/watch?v=-1cyCmUdDNQ -x --audio-format mp3,
                                    args = $" -f bestaudio {unencodedUri} -x --audio-format {convertto}";
                                    if (string.IsNullOrEmpty(convertto))
                                    {
                                        args = $" -f {formatcode} {unencodedUri}";
                                    }
                                }

                                postData.Add(new StringContent(args), "args");
                                postData.Add(new StringContent("youtube-dl"), "program");
                                postData.Add(new StringContent(guid), "guid");
                                postData.Add(new StringContent(video.FullName.Replace(" - YouTube", string.Empty)), "fileName");

                                var address = $"home/youtubedownload";
                                var request = new HttpRequestMessage(HttpMethod.Post, address);
                                request.Content = postData;
                                LoggingManager.Logger.Info($"SendAsync start '{args}'");

                                var sendAsync = client.SendAsync(
                                    request, HttpCompletionOption.ResponseHeadersRead);
                              
                                // важно, за да се позволи да се осъществи връзката.
                                sendAsync.Wait(5000);
                                return;                               
                            }
                        }
                        catch (Exception ex)
                        {
                            LoggingManager.Logger.Error(ex, ex.Message);
                        }
                    }
                }
                catch (Exception ex)
                {
                    LoggingManager.Logger.Error(ex, ex.Message);
                }
              
            });

            return Json(guid);
        }

        private YouTubeVideo GetVideo(string uri, string format, string formatCode, string resolution)
        {
            uri = HttpUtility.UrlDecode(uri).DecodeBase64();


            var youTube = YouTube.Default; // starting point for YouTube actions
            var videosToShow = youTube.GetAllVideos(uri).ToList(); // gets a Video object with info about the video
            YouTubeVideo video = videosToShow.FirstOrDefault(v => v.Format.ToString() == format
            && v.FormatCode.ToString() == formatCode && v.Resolution.ToString() == resolution);

            return video;
        }

        public ActionResult GetVideoUrlsFromPlaylistId(string uri)
        {
            if (uri.ToLowerInvariant().Contains("list=".ToLowerInvariant()) || uri.ToLowerInvariant().Contains("/channel/".ToLowerInvariant()))
            {
                Uri myUri = new Uri(uri);
                string listId = HttpUtility.ParseQueryString(myUri.Query).Get("list");
                if (!string.IsNullOrEmpty(listId))
                {
                    var result = YoutubeManager.GetVideoUrlsFromPlaylistId(listId);
                    return Json(result);
                }
                else if (uri.ToLowerInvariant().Contains("/channel/"))
                {
                    string channelId = string.Empty;
                    for (int i = 0; i < myUri.Segments.Length; i++)
                    {
                        if (myUri.Segments[i].ToLowerInvariant() == "channel/".ToLowerInvariant())
                        {
                            if (myUri.Segments.Length >= i + 1)
                            {
                                if (myUri.Segments[i + 1].EndsWith("/"))
                                {
                                    channelId = myUri.Segments[i + 1].Substring(0, myUri.Segments[i + 1].Length - 1);
                                }
                                else
                                {
                                    channelId = myUri.Segments[i + 1];
                                }
                            }
                        }
                    }
                     //HttpUtility.ParseQueryString(myUri.Query).Get("list");
                    if (!string.IsNullOrEmpty(channelId))
                    {
                        var result = YoutubeManager.GetVideoUrlsFromChannelId(channelId);
                        return Json(result);
                    }
                }
            }
            return Json(new List<string>());

        }
        public ActionResult _AudioPartial(string uri)
        {
            if (uri.ToLowerInvariant().Contains("youtu.be"))
            {
                uri = YoutubeManager.GetFullUrlFromYouTube(uri);
            }


            int maxTryAttempts = 2;
            for (int i = 0; i < maxTryAttempts; i++)
            {


                try
                {
                    uri = HttpUtility.UrlDecode(uri);

                    var link = uri;
                    var youTube = YouTube.Default; // starting point for YouTube actions
                    var videos = youTube.GetAllVideos(link).ToList(); // gets a Video object with info about the video

                    var youTubeGuid = string.Empty;

                    Uri uriObject = new Uri(uri);
                    youTubeGuid = HttpUtility.ParseQueryString(uriObject.Query).Get("v");



                    //var videos = MemoryCacheManager.Get("videos") as List<YouTubeVideo>;
                    //var video = videos.FirstOrDefault(v => v.Format ==  VideoFormat.Mp4 && v.Resolution == 360);

                    List<VideoViewModel> resultList = new List<VideoViewModel>();
                    foreach (var video in videos)
                    {


                        if (video != null)
                        {
                            VideoViewModel videoVM = new VideoViewModel();
                            videoVM.Guid = Guid.NewGuid().ToString();
                            videoVM.Format = video.Format.ToString();
                            videoVM.AdaptiveKind = video.AdaptiveKind.ToString();
                            videoVM.PosterUrl = $"//img.youtube.com/vi/{youTubeGuid}/1.jpg";
                            videoVM.AudioBitrate = video.AudioBitrate;
                            videoVM.AudioFormat = video.AudioFormat.ToString();
                            videoVM.FileExtension = video.FileExtension;
                            videoVM.FormatCode = video.FormatCode;

                            videoVM.title = video.Title.Replace(" - YouTube", string.Empty);
                            videoVM.AudioUrlMp4 = HttpUtility.UrlEncode(uri.EncodeBase64());
                            videoVM.Resolution = video.Resolution;
                            // тука забива
                            //videoVM.source = video.Uri;

                            //videoVM.AudioUrlToPlay = video.Uri;
                            videoVM.VideoId = youTubeGuid;
                            resultList.Add(videoVM);
                            //return PartialView(videoVM);
                        }
                    }
                    resultList = resultList.Where(r => r != null && r.AdaptiveKind != AdaptiveKind.None.ToString()).ToList();
                    return PartialView(resultList);
                }
                catch (Exception ex)
                {
                    LoggingManager.Logger.Error(ex, ex.Message);
                    Thread.Sleep(1000);
                }

            }
            return new EmptyResult();
        }

        public ActionResult Test()
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://localhost:49722/");
                client.Timeout = new TimeSpan(0, 20, 0);

                var postData = new MultipartFormDataContent();
                postData.Add(new StringContent("ffmpeg"), "program");
                postData.Add(new StringContent(" -i in -vn -f mp3 -ab 192k output.mp3"), "args");
                postData.Add(new StringContent("in"), "inputFileName");

                var bytes = System.IO.File.ReadAllBytes(@"C:\tmp\1.mp4");

                var inputBytesBase64 = Convert.ToBase64String(bytes);

                postData.Add(new StringContent(inputBytesBase64), "inputBytesBase64");


                var address = $"home/ExecFfmpeg";

                var response = client.PostAsync(address, postData).Result;
                if (response.IsSuccessStatusCode)
                {
                    string json = response.Content.ReadAsStringAsync().Result;

                }
            }
            return null;
        }

    }
}