using DownloadYoutubeWeb.Infrastructure;
using DownloadYoutubeWeb.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VideoLibrary;

namespace DownloadYoutubeWeb.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Videos_Read([DataSourceRequest] DataSourceRequest request)
        {
            return Json(GetVideos().ToDataSourceResult(request));
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

        public ActionResult DownloadAudio(string uri)
        {
            uri = HttpUtility.UrlDecode(uri).DecodeBase64();


            var youTube = YouTube.Default; // starting point for YouTube actions
            var videosToShow = youTube.GetAllVideos(uri).ToList(); // gets a Video object with info about the video
            var videos = videosToShow.Where(v => v.AdaptiveKind == AdaptiveKind.Audio);
            var video = videos.FirstOrDefault();
            var bytes = video.GetBytes();
            string contentType = MimeMapping.GetMimeMapping(video.FullName);
            var result = File(bytes, contentType, video.FullName);
            return result;


        }
        public ActionResult DownloadAudioFiles(string uri)
        {
            var result = MemoryCacheManager.Get("lastAudioFiles") as FileContentResult;
            return result;
        }

        private static IEnumerable<VideoViewModel> GetVideos()
        {
            return new List<VideoViewModel>();
            //var link = "https://www.youtube.com/watch?v=P5IstTo5bZw";
            //var youTube = YouTube.Default; // starting point for YouTube actions
            //var videosToShow = youTube.GetAllVideos(link).ToList(); // gets a Video object with info about the video

            //List<VideoViewModel> videos = new List<VideoViewModel>();



            //foreach (var v in videosToShow)
            //{
            //    VideoViewModel vm = new VideoViewModel();
            //    vm.title = v.Title;
            //    vm.AdaptiveKind = v.AdaptiveKind.ToString();
            //    vm.AudioBitrate = v.AudioBitrate;
            //    vm.AudioFormat = v.AudioFormat.ToString();
            //    vm.Format = v.Format.ToString();
            //    vm.FormatCode = v.FormatCode;
            //    vm.Is3D = v.Is3D;
            //    vm.IsAdaptive = v.IsAdaptive;
            //    vm.IsEncrypted = v.IsEncrypted;
            //    vm.Resolution = v.Resolution;
            //    vm.PosterUrl = "http://img.youtube.com/vi/P5IstTo5bZw/1.jpg";
            //    vm.source = v.Uri;
            //    vm.UriEncoded = HttpUtility.UrlEncode(v.Uri);

            //    videos.Add(vm);
            //}

            //var cache = MemoryCacheManager.Get("videos") as List<YouTubeVideo>;
            //if (cache != null)
            //{
            //    cache.AddRange(videosToShow);
            //    MemoryCacheManager.Set("videos", cache);
            //}
            //else
            //{
            //    MemoryCacheManager.Set("videos", videosToShow);
            //}

            //return videos;
        }

        public ActionResult _AudioPartial(string uri)
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
            videoVM.PosterUrl = $"http://img.youtube.com/vi/{youTubeGuid}/1.jpg";
            videoVM.AudioBitrate = video.AudioBitrate;
            videoVM.AudioFormat = video.AudioFormat.ToString();
            videoVM.title = video.Title;
            videoVM.source = video.Uri;
            videoVM.AudioUrl = HttpUtility.UrlEncode(uri.EncodeBase64());

            return PartialView(videoVM);
        }
    }
}