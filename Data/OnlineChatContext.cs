using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OnlineChat.Data.Entities;

namespace OnlineChat.Data
{
    public class OnlineChatContext : DbContext
    {
        private readonly IConfiguration _config;

        public OnlineChatContext(DbContextOptions options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
        //public DbSet<User> Users { get; set; }
        //public DbSet<Opinion> Opinions { get; set; }
        //public DbSet<ProductInCart> ProductsInCarts { get; set; }
        //public DbSet<Store> Store { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_config.GetConnectionString("OnlineChat"));
        }


        //dopisac pojedyncze encje
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Message>()
                .HasOne(m => m.UserFrom)
                .WithMany(m => m.MessagesFrom)
                .HasForeignKey(m => m.UserFromId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.UserTo)
                .WithMany(m => m.MessagesTo)
                .HasForeignKey(m => m.UserToId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Role = "admin",
                    Login = "admin1",
                    Password = "strongPassword1",
                    
                    //RefreshTokenExpiryTime = DateTime.Now
                },
                new User
                {
                    Id = 2,
                    Role = "user",
                    Login = "user1",
                    Password = "strongPassword2",
                    
                    //RefreshTokenExpiryTime = DateTime.Now
                });

            modelBuilder.Entity<Message>().HasData(
                new Message
                {
                    Id = 1,
                    UserFromId = 1,
                    UserToId = 2,
                    Content = "Cześć, co słychać?",
                    SendTime = DateTime.MinValue
                },
                new Message
                {
                    Id = 2,
                    UserFromId = 2,
                    UserToId = 1,
                    Content = "Hej, dziękuję, wszystko w porządku, a u Ciebie?",
                    SendTime = DateTime.MaxValue
                });

            //modelBuilder.Entity<Category>().HasData(
            //    new
            //    {
            //        Id = 1,
            //        Name = "Rakietki"
            //    },
            //    new
            //    {
            //        Id = 2,
            //        Name = "Stoły do gry"
            //    },
            //    new
            //    {
            //        Id = 3,
            //        Name = "Okładziny"
            //    },
            //    new
            //    {
            //        Id = 4,
            //        Name = "Deski"
            //    });

            //modelBuilder.Entity<Product>().HasData(
            //    new
            //    {
            //        Id = 1,
            //        CategoryId = 1,
            //        Name = "Rakietka Donic Waldner 2000",
            //        Description = "Amatorska rakietka do gry w tenisa stołowego firmy Donic",
            //        Price = 100,
            //        Amount = 25,
            //        AverageRating = 4.5
            //    },
            //    new
            //    {
            //        Id = 2,
            //        CategoryId = 2,
            //        Name = "Stół do tenisa stolowego Joma 3250",
            //        Description = "Stół do gry w tenisa stołowego Joma",
            //        Price = 2000,
            //        Amount = 5,
            //        AverageRating = 0.0
            //    });

            //modelBuilder.Entity<Opinion>().HasData(
            //    new
            //    {
            //        Id = 1,
            //        ProductId = 1,
            //        Content = "Dobry stosunek jakość - cena",
            //        Rating = 4,
            //        CriticId = 2
            //    },
            //    new
            //    {
            //        Id = 2,
            //        ProductId = 1,
            //        Content = "Wszystko w jak największym porządku",
            //        Rating = 5,
            //        CriticId = 1
            //    });

            //modelBuilder.Entity<Store>().HasData(
            //    new
            //    {
            //        Id = 1,
            //        Address = "ul. Poziomkowa 88 24-987 Warszawa"
            //    });

            //modelBuilder.Entity<StoreDescription>().HasData(
            //    new StoreDescription
            //    {
            //        Id = 1,
            //        StoreId = 1,
            //        DescriptionText = "Nasz sklep zajmuje się sprzedażą sprzętu sportowego, mamy wieloletnie doświadczeniue w dostosowywaniu oferty do potrzeb klienta."
            //    });

            //modelBuilder.Entity<StoreTelephoneNumber>().HasData(
            //    new StoreTelephoneNumber
            //    {
            //        Id = 1,
            //        StoreId = 1,
            //        TelephoneNumberContent = "+48 123 456 789"
            //    },
            //    new StoreTelephoneNumber
            //    {
            //        Id = 2,
            //        StoreId = 1,
            //        TelephoneNumberContent = "+48 32 12 36 647"
            //    }
            //);

            //modelBuilder.Entity<StoreEMail>().HasData(
            //    new StoreEMail
            //    {
            //        Id = 1,
            //        StoreId = 1,
            //        EmailContent = "good.store@gmail.com"
            //    },
            //    new StoreEMail
            //    {
            //        Id = 2,
            //        StoreId = 1,
            //        EmailContent = "dobry.sklep@gmail.com"
            //    });

            //modelBuilder.Entity<StoreHours>().HasData(
            //    new StoreHours
            //    {
            //        Id = 1,
            //        StoreId = 1,
            //        Day = DayOfWeek.Monday,
            //        OpenHour = "8:00",
            //        CloseHour = "16:00"
            //    },
            //    new StoreHours
            //    {
            //        Id = 2,
            //        StoreId = 1,
            //        Day = DayOfWeek.Tuesday,
            //        OpenHour = "8:00",
            //        CloseHour = "16:00"
            //    },
            //    new StoreHours
            //    {
            //        Id = 3,
            //        StoreId = 1,
            //        Day = DayOfWeek.Wednesday,
            //        OpenHour = "8:00",
            //        CloseHour = "16:00"
            //    },
            //    new StoreHours
            //    {
            //        Id = 4,
            //        StoreId = 1,
            //        Day = DayOfWeek.Thursday,
            //        OpenHour = "8:00",
            //        CloseHour = "16:00"
            //    },
            //    new StoreHours
            //    {
            //        Id = 5,
            //        StoreId = 1,
            //        Day = DayOfWeek.Friday,
            //        OpenHour = "8:00",
            //        CloseHour = "16:00"
            //    },
            //    new StoreHours
            //    {
            //        Id = 6,
            //        StoreId = 1,
            //        Day = DayOfWeek.Saturday,
            //        OpenHour = "8:00",
            //        CloseHour = "16:00"
            //    });


        }


    }
}
