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
        Task<User[]> GetAllUsersAsync(bool withTracking = false);
        Task<User> GetUserByIdAsync(int id, bool withTracking = false);
        Task<User> GetUserByLoginAndPasswordAsync(string login, string password, bool withTracking = false);
        Task<User> GetUserByLoginAsync(string login, bool withTracking = false);
        Task<User> GetUserByEmailAsync(string email, bool withTracking = false);

        // Messages
        Task<Message[]> GetAllMessagesAsync(bool withTracking = false);
        Task<Message> GetMessageByIdAsync(int id, bool withTracking = false);
        Task<Message[]> GetMessagesByUsersAsync(int userId1, int userId2, bool withTracking = false);
        Task<Message> GetLastMessageBetweenTwoUsersAync(int userId1, int userId2, bool withTracking = false);
        Task<Message[]> GetMessagesByUserAsync(int userId, bool withTracking = false);
    }
}
