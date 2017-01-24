﻿using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using VideoLibrary;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class YoutubeManager
    {
        //public string GetBestAudioCode(string format, string url)
        //{
        //    var youTube = YouTube.Default; // starting point for YouTube actions
        //    var videosToShow = youTube.GetAllVideos(url).ToList(); // gets a Video object with info about the video

        //    videosToShow = videosToShow.Where(f => f.AdaptiveKind == AdaptiveKind.Audio).ToList();
        //    videosToShow.OrderByDescending(f => f.AudioBitrate).FirstOrDefault(a => a.AudioFormat == AudioFormat.)
        //}

        public static List<string> GetVideoUrlsFromPlaylistId(string playlistId)
        {
            var apiKey = ConfigurationManager.AppSettings["googleApiKey"];

            var YouTubeService = new YouTubeService(new BaseClientService.Initializer() { ApiKey = apiKey });

            var PlaylistRequest = YouTubeService.PlaylistItems.List("snippet");

            // playlist request properties
            PlaylistRequest.PlaylistId = playlistId;
            PlaylistRequest.MaxResults = 50;
                 
            var PlaylistResponse = PlaylistRequest.Execute();

            List<string> videoUrls = new List<string>();

            foreach (var Video in PlaylistResponse.Items)
            {                             
                string VideoId = Video?.Snippet?.ResourceId?.VideoId;
                string Title = Video?.Snippet?.Title;
                string Url = string.Format("https://www.youtube.com/watch?v={0}", VideoId);
                string Image = Video?.Snippet?.Thumbnails?.High?.Url;

                videoUrls.Add(Url);
            }
            return videoUrls;
        }

        public static string GetFullUrlFromYouTube(string url)
        {
            if (url.ToLowerInvariant().Contains("youtu.be"))
            {
                using (HttpClient client = new HttpClient())
                {
                    var response = client.GetAsync(url).Result;
                    var fullUrl = response?.RequestMessage?.RequestUri?.ToString();
                    return fullUrl;
                }
            }
            else
            {
                return url;
            }
        }
    }
}