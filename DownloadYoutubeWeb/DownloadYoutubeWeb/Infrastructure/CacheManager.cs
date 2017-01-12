using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class MemoryCacheManager
    {
        public static void Set(string key, object value, int? hoursToExpire = null)
        {
            if (string.IsNullOrEmpty(key))
            {
                return;
            }
            if (!hoursToExpire.HasValue)
            {
                hoursToExpire = 168;
            }
            DateTimeOffset dto = new DateTimeOffset(DateTime.Now.AddHours(hoursToExpire.GetValueOrDefault()));
            MemoryCache.Default.Set(key, value, dto);
        }

        public static object Remove(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                return null;
            }
            object result = MemoryCache.Default.Remove(key);
            return result;
        }

        public static void RemoveAll()
        {
            MemoryCache.Default.Dispose();           
        }

        public static object Get(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                return null;
            }
            object result = MemoryCache.Default.Get(key);
            return result;
        }



    }
}
