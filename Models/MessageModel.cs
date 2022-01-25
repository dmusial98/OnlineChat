using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Models
{
    public class MessageModel
    {
        public int Id { get; set; }
        public int UserFromId { get; set; }
        public int UserToId { get; set; }
        public string Content { get; set; }
        public DateTime SendTime { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public UserModel UserFrom { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public UserModel UserTo { get; set; }
        public bool isRead { get; set; }
    }
}
