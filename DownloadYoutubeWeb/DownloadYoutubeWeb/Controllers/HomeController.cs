using DownloadYoutubeWeb.Infrastructure;
using DownloadYoutubeWeb.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using VideoLibrary;

namespace DownloadYoutubeWeb.Controllers
{
    public class HomeController : Controller
    {

        
        [OutputCache(Duration = 1)]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Download([DataSourceRequest] DataSourceRequest request, string uri)
        {
            uri = HttpUtility.UrlDecode(uri);
            var videos = MemoryCacheManager.Get("videos") as List<YouTubeVideo>;

            var video = videos.FirstOrDefault(v => v?.Uri?.StartsWith(uri, StringComparison.InvariantCultureIgnoreCase) == true);
            var bytes = video.GetBytes();
            string contentType = MimeMapping.GetMimeMapping(video.FullName);
            return File(bytes, contentType, video.FullName);
        }

        public ActionResult DownloadAudio(string uri, string type)
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
            var bytes = video.GetBytes();
            string contentType = MimeMapping.GetMimeMapping(video.FullName);
            var result = File(bytes, contentType, video.FullName);
            return result;


        }   
      

        public ActionResult _AudioPartial(string uri)
        {
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
                    var arr = uri.Split(new string[] { "v=" }, StringSplitOptions.RemoveEmptyEntries);
                    if (arr.Length == 2)
                    {
                        youTubeGuid = arr[1];
                    }

                    //var videos = MemoryCacheManager.Get("videos") as List<YouTubeVideo>;
                    var video = videos.FirstOrDefault(v => v.AdaptiveKind == AdaptiveKind.Audio);
                    VideoViewModel videoVM = new VideoViewModel();
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
    }
}