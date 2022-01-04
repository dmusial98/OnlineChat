using AutoMapper;
using OnlineChat.Data.Entities;
using OnlineChat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Data
{
    public class OnlineChatProfile : Profile
    {
        public OnlineChatProfile()
        {
            this.CreateMap<User, UserModel>()
                .ReverseMap();
            this.CreateMap<Message, MessageModel>()
                .ReverseMap();
        }
    }
}
