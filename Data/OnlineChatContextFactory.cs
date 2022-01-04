using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Data
{
    public class OnlineChatContextFactory
    {
        public OnlineChatContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json")
              .Build();

            return new OnlineChatContext(new DbContextOptionsBuilder<OnlineChatContext>().Options, config);
        }
    }
}
