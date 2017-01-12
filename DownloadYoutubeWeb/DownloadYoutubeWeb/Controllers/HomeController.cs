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

        public ActionResult DownloadAudio(string urls)
        {
            var lines = urls.Split('\n');
            foreach (var link in lines)
            {
                var youTube = YouTube.Default; // starting point for YouTube actions
                var videosToShow = youTube.GetAllVideos(link).ToList(); // gets a Video object with info about the video
                var video = videosToShow.Where(v => v.AdaptiveKind == AdaptiveKind.Audio).First();

                var bytes = video.GetBytes();
                string contentType = MimeMapping.GetMimeMapping(video.FullName);
                var result = File(bytes, contentType, video.FullName);
                MemoryCacheManager.Set("lastAudioFiles", result);
                return result;
            }

            return null;
        }
        public ActionResult DownloadAudioFiles()
        {
            var result = MemoryCacheManager.Get("lastAudioFiles") as FileContentResult;
            return result;
        }


        private static IEnumerable<VideoViewModel> GetVideos()
        {
            var link = "https://www.youtube.com/watch?v=P5IstTo5bZw";
            var youTube = YouTube.Default; // starting point for YouTube actions
            var videosToShow = youTube.GetAllVideos(link).ToList(); // gets a Video object with info about the video

            List<VideoViewModel> videos = new List<VideoViewModel>();

            foreach (var v in videosToShow)
            {
                VideoViewModel vm = new VideoViewModel();
                vm.title = v.Title;
                vm.AdaptiveKind = v.AdaptiveKind.ToString();
                vm.AudioBitrate = v.AudioBitrate;
                vm.AudioFormat = v.AudioFormat.ToString();
                vm.Format = v.Format.ToString();
                vm.FormatCode = v.FormatCode;
                vm.Is3D = v.Is3D;
                vm.IsAdaptive = v.IsAdaptive;
                vm.IsEncrypted = v.IsEncrypted;
                vm.Resolution = v.Resolution;                
                vm.PosterUrl = "http://img.youtube.com/vi/P5IstTo5bZw/1.jpg";
                vm.source = v.Uri;
                vm.UriEncoded = HttpUtility.UrlEncode(v.Uri);

                videos.Add(vm);
            }

            var cache = MemoryCacheManager.Get("videos") as List<YouTubeVideo>;
            if (cache != null)
            {
                cache.AddRange(videosToShow);
                MemoryCacheManager.Set("videos", cache);
            }
            else
            {
                MemoryCacheManager.Set("videos", videosToShow);
            }

            return videos;
        }
    }
}