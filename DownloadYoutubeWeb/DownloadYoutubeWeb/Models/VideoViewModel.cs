using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DownloadYoutubeWeb.Models
{
    public class VideoViewModel
    {
        public string AdaptiveKind { get; set; }
        public int AudioBitrate { get; set; }
        public string AudioFormat { get; set; }
        public string Format { get; set; }
        public int FormatCode { get; set; }
        public bool Is3D { get; set; }
        public bool IsAdaptive { get; set; }
        public bool IsEncrypted { get; set; }
        public int Resolution { get; set; }
        public string title { get; set; }
        public string source { get; set; }
        public string UriEncoded { get; set; }
        public string WebSite { get; set; }
        public string PosterUrl { get; set; }

        public string AudioUrl { get; set; }
    }
}