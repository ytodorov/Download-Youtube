using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class HtmlHelperExtensions
    {
        public static string GetOgMetaLocale(this HtmlHelper<dynamic> helper)
        {
            /*
             <meta property='og:locale' content='en_GB' />
             <meta property="og:locale:alternate" content="fr_FR" />
             <meta property="og:locale:alternate" content="es_ES" />
             */
            StringBuilder sb = new StringBuilder();
            CultureInfo ci = Thread.CurrentThread.CurrentCulture;
            if (ci.Name == CultureInfo.GetCultureInfo("bg-BG").Name)
            {
                sb.AppendLine ($"<meta property=\"og:locale\" content=\"bg_BG\" />");
                //sb.AppendLine($"<meta property=\"og:locale:alternate\" content=\"en_GB\" />");
            }
            else
            {
                sb.AppendLine($"<meta property='og:locale' content='en_GB' />");
                //sb.AppendLine($"<meta property='og:locale:alternate' content='bg_BG' />");
            }
            string result = sb.ToString();
            return result;
        }
    }
}