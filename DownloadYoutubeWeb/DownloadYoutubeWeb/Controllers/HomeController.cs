using DownloadYoutubeWeb.Infrastructure;
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
                                    Response.Redirect("/bg");
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
            }
            catch (Exception)
            {

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


        public ActionResult DownloadAudioStream(string guid)
        {
            ActionResult fs = MemoryCacheManager.Get(guid) as ActionResult;
            return fs;
        }

        public async Task<ActionResult> DownloadAudio(string uri, string format, string formatcode,
            string resolution, string convertto, string guid, bool? leftclick)
        {
            var errorMessage = string.Empty;

            for (int i = 0; i < MAX_RETRY_COUNT; i++)
            {


                try
                {

                    if (MemoryCacheManager.Get(guid) != null)
                    {
                        if (leftclick.GetValueOrDefault() != true)
                        {
                            return MemoryCacheManager.Get(guid) as ActionResult;
                        }
                        return Json(guid);
                    }


                    YouTubeVideo video = GetVideo(uri, format, formatcode, resolution);
                    string unencodedUri = HttpUtility.UrlDecode(uri).DecodeBase64();

                    Uri uriObject = new Uri(unencodedUri);
                    var query = uriObject.Query; //?v=F_DE-sfyFj8&feature=youtu.be
                    string v = HttpUtility.ParseQueryString(uriObject.Query).Get("v");
                    unencodedUri = unencodedUri.Replace(query, string.Empty);
                    // Това е важно за да премахнем всякакви други querystring параметри - те създават проблеми
                    unencodedUri = $"{unencodedUri}?v={v}";

                    if (video?.AdaptiveKind.ToString().IsCaseInsensitiveEqual("audio") == true && string.IsNullOrEmpty(convertto))
                    {
                        // Тук сме в случая само когато имаме звук в WebM или mp4 формат
                        var bytes = video.GetBytes();

                        string contentType = MimeMapping.GetMimeMapping(video.FullName);
                        var result = File(bytes, contentType, video.FullName.Replace("- YouTube", string.Empty));

                        if (leftclick.GetValueOrDefault() != true)
                        {
                            return result;
                        }
                        MemoryCacheManager.Set(guid, result, 1);
                        return Json(guid);
                    }




                    using (HttpClient client = new HttpClient())
                    {
                        client.BaseAddress = new Uri("http://localhost:49722/");
                        //client.BaseAddress = new Uri("http://ants-neu.cloudapp.net/");

                        client.Timeout = TimeSpan.FromMinutes(30);
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
                        }

                        postData.Add(new StringContent(args), "args");
                        postData.Add(new StringContent("youtube-dl"), "program");

                        var address = $"home/youtubedownload";

                        postData.Headers.Add("TransferEncodingChunked", "true");
                        //Exception of type 'System.OutOfMemoryException' was thrown.


                        //HttpWebRequest httpWebRequest = new HttpWebRequest();


                        HttpRequestMessage hrm = new HttpRequestMessage(HttpMethod.Post, address);
                        hrm.Content = postData;

                        //var response = await client.SendAsync(hrm);





                        //var response = client.PostAsync(address, postData).Result;
                        //if (response.IsSuccessStatusCode)
                        //address = $"{address}?args={args}&program=youtube-dl";


                        client.Timeout = TimeSpan.FromMilliseconds(Timeout.Infinite);
                        var requestUri = address;

                        var formUrlEncodedContent = new FormUrlEncodedContent(
                            new List<KeyValuePair<string, string>>() {
            new KeyValuePair<string, string>("userId", "1000") });

                        formUrlEncodedContent.Headers.ContentType =
                            new MediaTypeHeaderValue("application/x-www-form-urlencoded");

                        var request = new HttpRequestMessage(HttpMethod.Post, requestUri);
                        request.Content = postData;

                        var response = client.SendAsync(
                            request, HttpCompletionOption.ResponseHeadersRead).Result;
                        var stream = response.Content.ReadAsStreamAsync().Result;

                        //using (var reader = new StreamReader(stream))
                        {
                            string baseDir = HostingEnvironment.ApplicationPhysicalPath;
                            string tempFolderName = "tmp";
                            string fullDirPath = Path.Combine(baseDir, tempFolderName);
                            if (!Directory.Exists(fullDirPath))
                            {
                                Directory.CreateDirectory(fullDirPath);
                            }

                            string fileToWriteTo = Path.Combine(fullDirPath, Guid.NewGuid().ToString() + ".tmp");

                            //while (!reader.EndOfStream)
                            //{

                            //    //We are ready to read the stream
                            //    var currentLine = reader.ReadLine();
                              

                        


                            //}


                            byte[] buffer = new byte[16 * 1024];
                            using (FileStream ms = System.IO.File.OpenWrite(fileToWriteTo))
                            {
                                int read;
                                while ((read = stream.Read(buffer, 0, buffer.Length)) > 0)
                                {
                                    ms.Write(buffer, 0, read);
                                }
                               
                            }



                            string fn = video.FullName.Replace("- YouTube", string.Empty);
                            if (!string.IsNullOrEmpty(convertto))
                            {
                                fn = Path.GetFileNameWithoutExtension(video.FullName.Replace("- YouTube", string.Empty)) + "." + convertto;
                            }

                            string ct = MimeMapping.GetMimeMapping(fn);
                            var r = File(fileToWriteTo, ct, fn);
                            if (leftclick.GetValueOrDefault() != true)
                            {
                                return r;
                            }
                            MemoryCacheManager.Set(guid, r, 1);
                            return Json(guid);
                        }





                        //using (HttpResponseMessage response = await client.GetAsync(address, HttpCompletionOption.ResponseHeadersRead))
                        //{
                        //    using (Stream streamToReadFrom = await response.Content.ReadAsStreamAsync())
                        //    {
                        //        string baseDir = HostingEnvironment.ApplicationPhysicalPath;
                        //        string tempFolderName = "tmp";
                        //        string fullDirPath = Path.Combine(baseDir, tempFolderName);
                        //        if (!Directory.Exists(fullDirPath))
                        //        {
                        //            Directory.CreateDirectory(fullDirPath);
                        //        }

                        //        string fileToWriteTo = Path.Combine(fullDirPath, Guid.NewGuid().ToString() + ".tmp");

                        //        using (Stream streamToWriteTo = System.IO.File.Open(fileToWriteTo, FileMode.Create))
                        //        {
                        //            await streamToReadFrom.CopyToAsync(streamToWriteTo);
                        //        }

                        //        string fn = video.FullName.Replace("- YouTube", string.Empty);
                        //        if (!string.IsNullOrEmpty(convertto))
                        //        {
                        //            fn = Path.GetFileNameWithoutExtension(video.FullName.Replace("- YouTube", string.Empty)) + "." + convertto;
                        //        }

                        //        string ct = MimeMapping.GetMimeMapping(fn);
                        //        var r = File(fileToWriteTo, ct, fn);
                        //        if (leftclick.GetValueOrDefault() != true)
                        //        {
                        //            return r;
                        //        }
                        //        MemoryCacheManager.Set(guid, r, 1);
                        //        return Json(guid);
                        //    }
                        //}


                        //string error = response.Content.ReadAsStringAsync().Result;
                        return Json("error");
                    }

                }
                catch (Exception e)
                {
                    errorMessage = e.Message + e.StackTrace;
                }
            }
            return Json(errorMessage);
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