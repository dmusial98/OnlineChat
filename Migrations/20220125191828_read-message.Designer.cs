﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OnlineChat.Data;

namespace OnlineChat.Migrations
{
    [DbContext(typeof(OnlineChatContext))]
    [Migration("20220125191828_read-message")]
    partial class readmessage
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.13")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OnlineChat.Data.Entities.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("SendTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserFromId")
                        .HasColumnType("int");

                    b.Property<int>("UserToId")
                        .HasColumnType("int");

                    b.Property<bool>("isRead")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("UserFromId");

                    b.HasIndex("UserToId");

                    b.ToTable("Messages");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Content = "Cześć, co słychać?",
                            SendTime = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            UserFromId = 1,
                            UserToId = 2,
                            isRead = false
                        },
                        new
                        {
                            Id = 2,
                            Content = "Hej, dziękuję, wszystko w porządku, a u Ciebie?",
                            SendTime = new DateTime(9999, 12, 31, 23, 59, 59, 999, DateTimeKind.Unspecified).AddTicks(9999),
                            UserFromId = 2,
                            UserToId = 1,
                            isRead = false
                        });
                });

            modelBuilder.Entity("OnlineChat.Data.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Login")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("RefreshTokenExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Role")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Login = "admin1",
                            Password = "strongPassword1",
                            RefreshTokenExpiryTime = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Role = "admin"
                        },
                        new
                        {
                            Id = 2,
                            Login = "user1",
                            Password = "strongPassword2",
                            RefreshTokenExpiryTime = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Role = "user"
                        });
                });

            modelBuilder.Entity("OnlineChat.Data.Entities.Message", b =>
                {
                    b.HasOne("OnlineChat.Data.Entities.User", "UserFrom")
                        .WithMany("MessagesFrom")
                        .HasForeignKey("UserFromId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("OnlineChat.Data.Entities.User", "UserTo")
                        .WithMany("MessagesTo")
                        .HasForeignKey("UserToId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("UserFrom");

                    b.Navigation("UserTo");
                });

            modelBuilder.Entity("OnlineChat.Data.Entities.User", b =>
                {
                    b.Navigation("MessagesFrom");

                    b.Navigation("MessagesTo");
                });
#pragma warning restore 612, 618
        }
    }
}
