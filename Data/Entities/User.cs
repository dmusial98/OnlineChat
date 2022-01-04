using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public List<Message> MessagesFrom { get; set; }
        public List<Message> MessagesTo { get; set; }


    }
}
