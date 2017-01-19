using MediaToolkit;
using MediaToolkit.Model;
using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace DownloadYoutubeWeb.Infrastructure
{
    public static class AudioUtils
    {
        public static void ConvertAiffToWav(string aiffFile, string wavFile)
        {
            using (AiffFileReader reader = new AiffFileReader(aiffFile))
            {
                using (WaveFileWriter writer = new WaveFileWriter(wavFile, reader.WaveFormat))
                {
                    byte[] buffer = new byte[4096];
                    int bytesRead = 0;
                    do
                    {
                        bytesRead = reader.Read(buffer, 0, buffer.Length);
                        writer.Write(buffer, 0, bytesRead);
                    } while (bytesRead > 0);
                }
            }
        }

        public static byte[] GetMp3Bytes(byte[] inputBytes, string fuleName)
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://localhost:49722/");
                client.Timeout = new TimeSpan(0, 20, 0);

                var postData = new MultipartFormDataContent();
                postData.Add(new StringContent("ffmpeg"), "program");
                postData.Add(new StringContent($" -i {fuleName} -vn -f mp3 -ab 192k output.mp3"), "args");
                postData.Add(new StringContent(fuleName), "inputFileName");

                //var bytes = System.IO.File.ReadAllBytes(@"C:\tmp\1.mp4");

                var inputBytesBase64 = Convert.ToBase64String(inputBytes);

                postData.Add(new StringContent(inputBytesBase64), "inputBytesBase64");


                var address = $"home/ExecFfmpeg";

                var response = client.PostAsync(address, postData).Result;
                if (response.IsSuccessStatusCode)
                {
                    string stringResult = response.Content.ReadAsStringAsync().Result;
                    var returnMp3Bytes = Convert.FromBase64String(stringResult);
                    return returnMp3Bytes;

                }
            }
            return null;
        }

        public static byte[] ConvertToMp3Bytes(HttpServerUtilityBase server, byte[] bytes, string extensionWithDot)
        {
            var folderPath = server.MapPath("~/tmp");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var tempFileInput = Path.Combine(folderPath, Guid.NewGuid().ToString() + extensionWithDot);

            File.WriteAllBytes(tempFileInput, bytes);

            var tempFileOutput = Path.Combine(folderPath, Guid.NewGuid().ToString() + ".mp3");
            
            var inputFile = new MediaFile { Filename = tempFileInput };
            var outputFile = new MediaFile { Filename = tempFileOutput };

            byte[] result = null;
            using (var engine = new Engine())
            {
                engine.GetMetadata(inputFile);

                engine.Convert(inputFile, outputFile);

                result = File.ReadAllBytes(outputFile.Filename);

            }

            for (int i = 0; i < 5; i++)
            {                
                File.Delete(tempFileInput);
                File.Delete(tempFileOutput);
                break;
            }

           

            return result;
        }

        
    }
}