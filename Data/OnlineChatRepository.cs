using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OnlineChat.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Data
{
    public class OnlineChatRepository : IOnlineChatRepository
    {
        private readonly OnlineChatContext _context;
        private readonly ILogger<OnlineChatRepository> _logger;

        public OnlineChatRepository(OnlineChatContext context, ILogger<OnlineChatRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void Add<T>(T entity) where T : class
        {
            _logger.LogInformation($"Adding an object of type {entity.GetType()} to the context.");
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _logger.LogInformation($"Removing an object of type {entity.GetType()} to the context.");
            _context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            _logger.LogInformation($"Attempitng to save the changes in the context");

            // Only return success if at least one row was changed
            return (await _context.SaveChangesAsync()) > 0;
        }

        public async Task<User[]> GetAllUsersAsync()
        {
            var query = _context.Users.Include(u => u.MessagesFrom).Include(u=> u.MessagesTo);

            return await query.ToArrayAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var query = _context.Users.Where(u => u.Id == id);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByLoginAndPasswordAsync(string login, string password)
        {
            var query = _context.Users.Where(u => u.Login == login && u.Password == password);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByLoginAsync(string login)
        {
            var query = _context.Users.Where(u => u.Login == login);
            return await query.FirstOrDefaultAsync();
        }


        public async Task<User> GetUserByEmailAsync(string email)
        {
            var query = _context.Users.Where(u => u.Email == email);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Message[]> GetAllMessagesAsync()
        {
            var query = _context.Messages.Include(m => m.UserFrom).Include(m => m.UserTo);

            return await query.ToArrayAsync();
        }

        public async Task<Message> GetMessageByIdAsync(int id)
        {
            var query = _context.Messages.Where(m => m.Id == id).Include(m => m.UserFrom).Include(m => m.UserTo);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Message[]> GetMessagesByUserAsync(int userId1, int userId2)
        {
            var query = _context.Messages.Where(m => (m.UserFromId == userId1 && m.UserToId == userId2) || (m.UserToId == userId1 && m.UserFromId == userId2));

            return await query.ToArrayAsync();
        }

    }
}
