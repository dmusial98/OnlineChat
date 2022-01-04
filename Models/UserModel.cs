using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public List<MessageModel> MessagesFrom { get; set; }
        public List<MessageModel> MessagesTo { get; set; }
    }
}
