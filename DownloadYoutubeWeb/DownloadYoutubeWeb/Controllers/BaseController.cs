using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace DownloadYoutubeWeb.Controllers
{
    public class BaseController : Controller
    {
        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding)
        {
            var baseResult = base.Json(data, contentType, contentEncoding, JsonRequestBehavior.AllowGet);
            baseResult.MaxJsonLength = int.MaxValue;
            return baseResult;
        }

        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            behavior = JsonRequestBehavior.AllowGet;
            var baseResult = base.Json(data, contentType, contentEncoding, behavior);
            baseResult.MaxJsonLength = int.MaxValue;
            return baseResult;
        }

        protected override void HandleUnknownAction(string actionName)
        {
            if (Request.Cookies["userSetLangugaTo"] == null)
            {
                Response.Redirect("/");
            }
            else
            {
                var lang = Request.Cookies["userSetLangugaTo"].Value;
                Response.Redirect("/" + lang);
            }

            //base.HandleUnknownAction(actionName);
        }
    }
}