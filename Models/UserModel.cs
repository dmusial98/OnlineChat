using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Role { get; set; }
        [Required]
        public string Login { get; set; }
        public string Password { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public List<MessageModel> MessagesFrom { get; set; }
        public List<MessageModel> MessagesTo { get; set; }
    }
}
