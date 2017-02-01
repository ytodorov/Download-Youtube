using Google.Apis.Services;
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
        public static List<string> GetVideoUrlsFromPlaylistId(string playlistId)
        {
            var apiKey = ConfigurationManager.AppSettings["googleApiKey"];

            var YouTubeService = new YouTubeService(new BaseClientService.Initializer() { ApiKey = apiKey });

            var PlaylistRequest = YouTubeService.PlaylistItems.List("snippet");
                       

            // playlist request properties
            PlaylistRequest.PlaylistId = playlistId;
            PlaylistRequest.MaxResults = 20;
                 
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

        public static List<string> GetVideoUrlsFromChannelId(string channelId)
        {
            var apiKey = ConfigurationManager.AppSettings["googleApiKey"];

            var youtubeService = new YouTubeService(new BaseClientService.Initializer() { ApiKey = apiKey });

            var channelRequest = youtubeService.Channels.List("contentDetails");


            // playlist request properties
            channelRequest.Id = channelId;
            channelRequest.MaxResults = 20;

            var channelsListResponse = channelRequest.Execute();

            List<string> videoUrls = new List<string>();

            foreach (var channel in channelsListResponse.Items)
            {
                // From the API response, extract the playlist ID that identifies the list
                // of videos uploaded to the authenticated user's channel.
                var uploadsListId = channel.ContentDetails.RelatedPlaylists.Uploads;

                Console.WriteLine("Videos in list {0}", uploadsListId);

                var nextPageToken = "";
                while (nextPageToken != null)
                {
                    var playlistItemsListRequest = youtubeService.PlaylistItems.List("snippet");
                    playlistItemsListRequest.PlaylistId = uploadsListId;
                    playlistItemsListRequest.MaxResults = 50;
                    playlistItemsListRequest.PageToken = nextPageToken;

                    // Retrieve the list of videos uploaded to the authenticated user's channel.
                    var playlistItemsListResponse = playlistItemsListRequest.Execute();

                    foreach (var playlistItem in playlistItemsListResponse.Items)
                    {
                        // Print information about each video.
                        //Console.WriteLine("{0} ({1})", playlistItem.Snippet.Title, playlistItem.Snippet.ResourceId.VideoId);
                        string VideoId = playlistItem?.Snippet?.ResourceId?.VideoId;
                        string Title = playlistItem?.Snippet?.Title;
                        string Url = string.Format("https://www.youtube.com/watch?v={0}", VideoId);
                        string Image = playlistItem?.Snippet?.Thumbnails?.High?.Url;

                        videoUrls.Add(Url);
                        if (videoUrls.Count >= 20)
                        {
                            break;
                        }
                    }
                    if (videoUrls.Count >= 20)
                    {
                        break;
                    }

                    nextPageToken = playlistItemsListResponse.NextPageToken;
                }
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