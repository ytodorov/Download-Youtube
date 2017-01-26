
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class LoggingManager
    {
        private static readonly Logger logger = LogManager.GetLogger("logentries");

        public static Logger Logger
        {
            get
            {
                return logger;
            }
        }

        static LoggingManager()
        {
            
        }
    }
}