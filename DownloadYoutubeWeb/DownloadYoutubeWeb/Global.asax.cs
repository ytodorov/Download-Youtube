﻿using DownloadYoutubeWeb.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace DownloadYoutubeWeb
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            LoggingManager.Logger.Info("ApplicationStart");

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            ControllerBuilder.Current.SetControllerFactory(new DefaultControllerFactory(new LocalizedControllerActivator()));
        }
        protected void Application_Error()
        {
            Exception ex = Server.GetLastError();
            LoggingManager.Logger.Error(ex, ex.Message);
            // Yordan, handle error 500
            if (ex is HttpException)
            {
                Response.Redirect("/");
            }
        }
    }


}