using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class WebUtils
    {
        public static string Tag(string rootRelativePath)
        {
            string applicationVirtualPath = System.Web.Hosting.HostingEnvironment.ApplicationVirtualPath;
            if (applicationVirtualPath != "/")
            {
                rootRelativePath = applicationVirtualPath + rootRelativePath;
            }

            if (HttpRuntime.Cache[rootRelativePath] == null)
            {
                string absolute = HostingEnvironment.MapPath("~" + rootRelativePath);

                DateTime date = File.GetLastWriteTime(absolute);
                int index = rootRelativePath.LastIndexOf('/');
                string result = rootRelativePath.Insert(index, "/v-" + date.Ticks);
                if (applicationVirtualPath != "/")
                {
                    string stringToReplace = @"\" + applicationVirtualPath.Replace("/", string.Empty);

                    absolute = ReplaceLastOccurrence(absolute, stringToReplace, string.Empty); // absolute.Replace(stringToReplace, string.Empty);
                }
                HttpRuntime.Cache.Insert(rootRelativePath, result, new CacheDependency(absolute));
            }

            var resultToReturn = HttpRuntime.Cache[rootRelativePath] as string;

            return resultToReturn;
        }
        private static string ReplaceLastOccurrence(string source, string find, string replace)
        {
            int place = source.LastIndexOf(find);
            string result = source.Remove(place, find.Length).Insert(place, replace);
            return result;
        }
    }
}