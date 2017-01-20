using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace DownloadYoutubeWeb.Infrastructure
{
    public class LocalizedControllerActivator : IControllerActivator
    {
        private string _DefaultLanguage = "en";

        public IController Create(RequestContext requestContext, Type controllerType)
        {
            //Get the {language} parameter in the RouteData
            string lang = _DefaultLanguage;
            if (requestContext.RouteData.Values["lang"] != null)
            {
                lang = requestContext.RouteData.Values["lang"].ToString();
            }

            //if (lang != _DefaultLanguage)
            //{
            try
            {
                if (lang.Equals("bg", StringComparison.InvariantCultureIgnoreCase))
                {
                    Thread.CurrentThread.CurrentCulture =
                    Thread.CurrentThread.CurrentUICulture = new CultureInfo("bg-BG");
                }
                else
                {
                    Thread.CurrentThread.CurrentCulture =
                    Thread.CurrentThread.CurrentUICulture = new CultureInfo("en-GB");
                }
            }
            catch (Exception)
            {
                // Yordan
                //throw new NotSupportedException(String.Format("ERROR: Invalid language code '{0}'.", lang));
            }
            //}

            return DependencyResolver.Current.GetService(controllerType) as IController;
        }
    }
}