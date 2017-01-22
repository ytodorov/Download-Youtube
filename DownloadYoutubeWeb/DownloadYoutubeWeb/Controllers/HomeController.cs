using DownloadYoutubeWeb.Infrastructure;
using DownloadYoutubeWeb.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Telerik.Windows.Zip;
using VideoLibrary;

namespace DownloadYoutubeWeb.Controllers
{
    public class HomeController : Controller
    {
        protected override void HandleUnknownAction(string actionName)
        {
            if (Request.Cookies["userSetLangugaTo"] == null)
            {
                Response.Redirect("/");
            }
            else
            {
                var lang = Request.Cookies["userSetLangugaTo"].Value;
                Response.Redirect("/" + lang);
            }
               
            //base.HandleUnknownAction(actionName);
        }
        //protected override void OnActionExecuting(ActionExecutingContext filterContext)
        //{

        //    base.OnActionExecuting(filterContext);
        //}

        //[OutputCache(Duration = 1, Location = System.Web.UI.OutputCacheLocation.Server)]
        public ActionResult Index()
        {
            if (Request.Url.ToString().IndexOf("/bg", StringComparison.InvariantCultureIgnoreCase) == -1)
            {
                if (Request.Cookies["userSetLangugaTo"] == null)
                {
                    if (!Request.IsLocal)
                    {
                        using (HttpClient client = new HttpClient())
                        {
                            var ip = Request.UserHostAddress;
                            var uriToGet = $"https://toolsfornet.com/iplocation/getipcountrycode?ip={ip}";
                            var twoLetterCountry = client.GetStringAsync(uriToGet).Result?.ToLowerInvariant();
                            if ("bg".Equals(twoLetterCountry, StringComparison.InvariantCultureIgnoreCase))
                            {
                                Response.Redirect("/bg");
                            }
                        }
                    }
                    else
                    {
                        using (HttpClient client = new HttpClient())
                        {
                            var ip = "77.70.121.132";
                            var uriToGet = $"https://toolsfornet.com/iplocation/getipcountrycode?ip={ip}";
                            var twoLetterCountry = client.GetStringAsync(uriToGet).Result?.ToLowerInvariant();
                            if ("bg".Equals(twoLetterCountry, StringComparison.InvariantCultureIgnoreCase))
                            {
                                Response.Redirect("/bg");
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


            return View();
        }

        public ActionResult DownloadAll(string[] uris, string type)
        {
            //uris = new string[] { "https://www.youtube.com/watch?v=MAqrLgRYxiU", "https://www.youtube.com/watch?v=tAbbE1oMXJQ" };
            //using (MemoryStream memoryStream = new MemoryStream())
            //{
            //    using (ZipArchive archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true, null))
            //    {
            //        foreach (var uri in uris)
            //        {
            //            YouTubeVideo video = GetVideo(HttpUtility.UrlEncode(uri.EncodeBase64()), type);

            //            if (archive.Entries.Any(e => e.Name.Equals(video?.FullName, StringComparison.InvariantCultureIgnoreCase)))
            //            {
            //                continue;
            //            }
            //            using (ZipArchiveEntry entry = archive.CreateEntry(video?.FullName))
            //            {
            //                var renderedBytes = video.GetBytes();
            //                BinaryWriter writer = new BinaryWriter(entry.Open());
            //                writer.Write(renderedBytes);
            //                writer.Flush();
            //            }
            //        }

            //    }
            //    var arr = memoryStream.ToArray();
            //    string contentType = MimeMapping.GetMimeMapping("AllFiles.zip");
            //    return File(arr, "application/zip", "AllFiles.zip");
            //    //return File(arr, contentType, "AllFiles.zip");
            //}
            return new EmptyResult();
        }



        public ActionResult DownloadAudio(string uri, string format, string formatcode, string resolution, string convertto)
        {
            try
            {
                YouTubeVideo video = GetVideo(uri, format, formatcode, resolution);

                if (!string.IsNullOrEmpty(convertto))
                {
                    var inputBytes = video.GetBytes();
                    var inputFileBytesAsBase64String = Convert.ToBase64String(inputBytes);
                    var inputFileExtensionWithDot = video.FileExtension;
                    var outputFileExtensionWithDot = $".{convertto}";

                    using (HttpClient client = new HttpClient())
                    {
                        //client.BaseAddress = new Uri("http://localhost:49722/");
                        client.BaseAddress = new Uri("http://ants-neu.cloudapp.net/");

                        client.Timeout = TimeSpan.FromMinutes(10);

                        var postData = new MultipartFormDataContent();
                        postData.Add(new StringContent(inputFileBytesAsBase64String), "inputFileBytesAsBase64String");
                        postData.Add(new StringContent(inputFileExtensionWithDot), "inputFileExtensionWithDot");
                        postData.Add(new StringContent(outputFileExtensionWithDot), "outputFileExtensionWithDot");

                        var address = $"home/ConvertAudio";

                        var response = client.PostAsync(address, postData).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            string str = response.Content.ReadAsStringAsync().Result;
                            byte[] bArray = Convert.FromBase64String(str);

                            string fn = Path.GetFileNameWithoutExtension(video.FullName) + "." + convertto;

                            string ct = MimeMapping.GetMimeMapping(fn);
                            var r = File(bArray, ct, fn);
                            return r;
                        }
                    }

                }

                //var realUri = video.GetUriAsync().Result;

                //Stream stream = null;
                //using (HttpClient client = new HttpClient())
                //{
                //    var response = client.GetAsync(realUri).Result;

                //    stream = response.Content.ReadAsStreamAsync().Result;
                //}


                ////var stream = video.Stream();
                //stream.Position = 0;
                //byte[] bytes = new byte[stream.Length];

                //stream.Read(bytes, 0, bytes.Length);

                var bytes = video.GetBytes();

                //bytes = AudioUtils.ConvertToMp3Bytes(Server, bytes, video.FileExtension);
                string contentTypeMp3 = MimeMapping.GetMimeMapping("test.mp3");
                string mp3FileName = Path.GetFileNameWithoutExtension(video.FullName) + ".mp3";

                string contentType = MimeMapping.GetMimeMapping(video.FullName);
                var result = File(bytes, contentType, video.FullName);

                //var mp3Bytes = AudioUtils.GetMp3Bytes(bytes, Guid.NewGuid().ToString());
                //string contentTypeMp3 = MimeMapping.GetMimeMapping("test.mp3");

                //var changedExtension = video.FullName.Replace(video.FileExtension, ".mp3");

                //var result = File(mp3Bytes, contentTypeMp3, changedExtension);

                return result;
            }
            catch (Exception e)
            {
                return Json(e.Message + e.StackTrace);
            }



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
            if (uri.ToLowerInvariant().Contains("list=".ToLowerInvariant()))
            {
                Uri myUri = new Uri(uri);
                string listId = HttpUtility.ParseQueryString(myUri.Query).Get("list");
                if (!string.IsNullOrEmpty(listId))
                {
                    var result = YoutubeManager.GetVideoUrlsFromPlaylistId(listId);
                    return Json(result);
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


            int maxTryAttempts = 5;
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
                catch (Exception)
                {
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