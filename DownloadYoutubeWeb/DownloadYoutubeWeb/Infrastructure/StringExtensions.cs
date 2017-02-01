using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class StringExtensions
    {
        /// <summary>
        /// Encodes the input value to a Base64 string using the default encoding.
        /// </summary>
        /// <param name = "value">The input value.</param>
        /// <returns>The Base 64 encoded string</returns>
        public static string EncodeBase64(this string value)
        {
            return value.EncodeBase64(null);
        }

        /// <summary>
        /// 	Encodes the input value to a Base64 string using the supplied encoding.
        /// </summary>
        /// <param name = "value">The input value.</param>
        /// <param name = "encoding">The encoding.</param>
        /// <returns>The Base 64 encoded string</returns>
        public static string EncodeBase64(this string value, Encoding encoding)
        {
            encoding = (encoding ?? Encoding.UTF8);
            var bytes = encoding.GetBytes(value);
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// 	Decodes a Base 64 encoded value to a string using the default encoding.
        /// </summary>
        /// <param name = "encodedValue">The Base 64 encoded value.</param>
        /// <returns>The decoded string</returns>
        public static string DecodeBase64(this string encodedValue)
        {
            return encodedValue.DecodeBase64(null);
        }

        /// <summary>
        /// 	Decodes a Base 64 encoded value to a string using the supplied encoding.
        /// </summary>
        /// <param name = "encodedValue">The Base 64 encoded value.</param>
        /// <param name = "encoding">The encoding.</param>
        /// <returns>The decoded string</returns>
        public static string DecodeBase64(this string encodedValue, Encoding encoding)
        {
            encoding = (encoding ?? Encoding.UTF8);
            var bytes = Convert.FromBase64String(encodedValue);
            return encoding.GetString(bytes);
        }

        public static string PadLeftYordan(this string valueToPad, int totalLength, string paddingChar)
        {
            if (valueToPad.Length <= 40)
            {
                return valueToPad;
            }
            else
            {
                return valueToPad.Substring(0, 40);
            }
                
            //if (valueToPad.Length <= 45)
            //{
            //    return "<br />" + valueToPad;
            //}
            //else if (valueToPad.Length <= 90)
            //{
            //    return valueToPad;
            //}
            //else
            //{
            //    return valueToPad.Substring(0, 90);
            //}


            //int actualLength = valueToPad.Length;
            //if (actualLength >= totalLength)
            //{
            //    return valueToPad;
            //}
            //int diffLength = totalLength - actualLength;

            //StringBuilder sb = new StringBuilder();
            //for (int i = 0; i < diffLength; i++)
            //{
            //    sb.Append(paddingChar);
            //}

            //string result = sb.ToString() + valueToPad;
            //return result;
        }
    }
}