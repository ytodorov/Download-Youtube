﻿using DownloadYoutubeWeb.Infrastructure;
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


        [OutputCache(Duration = 1, Location = System.Web.UI.OutputCacheLocation.Server)]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult DownloadAll(string[] uris, string type)
        {
            uris = new string[] { "https://www.youtube.com/watch?v=MAqrLgRYxiU", "https://www.youtube.com/watch?v=tAbbE1oMXJQ" };
            using (MemoryStream memoryStream = new MemoryStream())
            {
                using (ZipArchive archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true, null))
                {
                    foreach (var uri in uris)
                    {
                        YouTubeVideo video = GetVideo(HttpUtility.UrlEncode(uri.EncodeBase64()), type);

                        if (archive.Entries.Any(e => e.Name.Equals(video?.FullName, StringComparison.InvariantCultureIgnoreCase)))
                        {
                            continue;
                        }
                        using (ZipArchiveEntry entry = archive.CreateEntry(video?.FullName))
                        {
                            var renderedBytes = video.GetBytes();
                            BinaryWriter writer = new BinaryWriter(entry.Open());
                            writer.Write(renderedBytes);
                            writer.Flush();
                        }
                    }

                }
                var arr = memoryStream.ToArray();
                string contentType = MimeMapping.GetMimeMapping("AllFiles.zip");
                return File(arr, "application/zip", "AllFiles.zip");
                //return File(arr, contentType, "AllFiles.zip");
            }

        }

        

        public ActionResult DownloadAudio(string uri, string type)
        {
            YouTubeVideo video = GetVideo(uri, type);
            var bytes = video.GetBytes();
            string contentType = MimeMapping.GetMimeMapping(video.FullName);
            var result = File(bytes, contentType, video.FullName);

            //var mp3Bytes = AudioUtils.GetMp3Bytes(bytes, Guid.NewGuid().ToString());
            //string contentTypeMp3 = MimeMapping.GetMimeMapping("test.mp3");

            //var changedExtension = video.FullName.Replace(video.FileExtension, ".mp3");

            //var result = File(mp3Bytes, contentTypeMp3, changedExtension);

            

            return result;
        }

        private YouTubeVideo GetVideo(string uri, string type)
        {
            uri = HttpUtility.UrlDecode(uri).DecodeBase64();


            var youTube = YouTube.Default; // starting point for YouTube actions
            var videosToShow = youTube.GetAllVideos(uri).ToList(); // gets a Video object with info about the video
            var videos = videosToShow.Where(v => v.AdaptiveKind == AdaptiveKind.Audio);
            YouTubeVideo video = null;
            if (type?.IsCaseInsensitiveEqual("Mp4") == true)
            {
                video = videos.FirstOrDefault(v => v.Format == VideoFormat.Mp4);
            }
            else
            {
                video = videos.FirstOrDefault(v => v.Format != VideoFormat.Mp4);
            }
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
                    var video = videos.FirstOrDefault(v => v.AdaptiveKind == AdaptiveKind.Audio);
                    VideoViewModel videoVM = new VideoViewModel();
                    videoVM.Guid = Guid.NewGuid().ToString();
                    videoVM.PosterUrl = $"//img.youtube.com/vi/{youTubeGuid}/1.jpg";
                    videoVM.AudioBitrate = video.AudioBitrate;
                    videoVM.AudioFormat = video.AudioFormat.ToString();
                    videoVM.FileExtension = video.FileExtension;
                    videoVM.title = video.Title.Replace(" - YouTube", string.Empty);
                    videoVM.source = video.Uri;
                    videoVM.AudioUrlMp4 = HttpUtility.UrlEncode(uri.EncodeBase64());
                    videoVM.AudioUrlToPlay = video.Uri;
                    return PartialView(videoVM);
                }
                catch (Exception)
                {
                    Thread.Sleep(500);
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