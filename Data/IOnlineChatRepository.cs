using OnlineChat.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Data
{
    public interface IOnlineChatRepository
    {
        // General 
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();

        // Users
        Task<User[]> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByLoginAndPasswordAsync(string login, string password);
        Task<User> GetUserByLoginAsync(string login);
        Task<User> GetUserByEmailAsync(string email);

        // Messages
        Task<Message[]> GetAllMessagesAsync();
        Task<Message> GetMessageByIdAsync(int id);
        Task<Message[]> GetMessagesByUsersAsync(int userId1, int userId2);
        Task<Message> GetLastMessageBetweenTwoUsersAync(int userId1, int userId2);
    }
}
