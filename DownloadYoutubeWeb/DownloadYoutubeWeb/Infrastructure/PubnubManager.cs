using PubNubMessaging.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class PubnubManager
    {
        private static Pubnub pubnub = new Pubnub("pub-c-5bd3c97d-e760-4aa8-9b91-0746c78606f9",
           "sub-c-406da20e-e48e-11e6-b325-02ee2ddab7fe", "sec-c-MzkzZmE0Y2UtODRkMC00MzcxLThmMTYtNWIzOGQyOTVmYjgz");

        static PubnubManager()
        {           
            pubnub.Time(UserCallback, ErrorCallback);
        }

        public static void Subscribe(string channel)
        {
            pubnub.Subscribe(channel, SubscribeCallback, ConnectCallback, ErrorCallback);
        }

        public static void Publish(string message)
        {
            pubnub.Publish("DY", message, UserCallback, ErrorCallback);
        }

        public static void UserCallback(object o)
        {

        }

        public static void SubscribeCallback(object o)
        {

        }

        public static void ConnectCallback(object o)
        {

        }

        public static void ErrorCallback(PubnubClientError error)
        {

        }
    }
}