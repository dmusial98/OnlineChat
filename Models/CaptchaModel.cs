using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Models
{
    public class CaptchaModel
    {
        public string captchaResponse { get; set; }
        public bool captchaAnswer{ get; set; }
    }
}
