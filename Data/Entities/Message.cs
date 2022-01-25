using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Data.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int UserFromId {get; set;}
        public int UserToId { get; set; }
        public string Content { get; set; }
        public DateTime SendTime { get; set; }
        public User UserFrom { get; set; }
        public User UserTo { get; set; }
        public bool isRead { get; set; } 
    }
}
