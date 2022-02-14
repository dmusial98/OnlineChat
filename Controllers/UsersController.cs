using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using OnlineChat.Data;
using OnlineChat.Data.Entities;
using OnlineChat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OnlineChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IOnlineChatRepository _repository;
        private readonly IMapper _mapper;
        private readonly LinkGenerator _linkGenerator;

        public UsersController(IOnlineChatRepository repository, IMapper mapper, LinkGenerator linkGenerator)
        {
            _repository = repository;
            _mapper = mapper;
            _linkGenerator = linkGenerator;
        }


        [HttpGet]
        public async Task<ActionResult<UserModel[]>> Get()
        {
            try
            {
                var result = await _repository.GetAllUsersAsync();
                return _mapper.Map<UserModel[]>(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<UserModel>> Get(int id)
        {
            try
            {
                var result = await _repository.GetUserByIdAsync(id);
                return _mapper.Map<UserModel>(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserModel>> Post(UserModel model)
        {
            try
            {
                var user = _mapper.Map<User>(model);

                _repository.Add(user);
                if (await _repository.SaveChangesAsync())
                {
                    return Created($"/api/users/{user.Id}", _mapper.Map<UserModel>(user));
                }
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<UserModel>> Put(int id, UserModel model)
        {
            try
            {
                var oldUser = await _repository.GetUserByIdAsync(id);
                if (oldUser == null) return NotFound($"Could not find user with id equal {id}");

                _mapper.Map(model, oldUser);

                if (await _repository.SaveChangesAsync())
                    return _mapper.Map<UserModel>(oldUser);
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var oldUser = await _repository.GetUserByIdAsync(id);
                if (oldUser == null) return NotFound($"Could not find user with id equal {id}");

                _repository.Delete(oldUser);

                if (await _repository.SaveChangesAsync())
                    return Ok();
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        [HttpHead("markMessagesAsRead/{id:int}"), Authorize]
        public async Task<IActionResult> MarkMessagesAsRead(int id)
        {
            try
            { 
                string userIdFromString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userIdFrom = -1;

                if (!String.IsNullOrEmpty(userIdFromString))
                {
                    userIdFrom = int.Parse(userIdFromString);

                    var messages = await _repository.GetMessagesByUsersAsync(userIdFrom, id);
                    var newMessages = messages.Where(m => m.isRead == false);

                    foreach (var mess in newMessages)
                        mess.isRead = true;

                    await _repository.SaveChangesAsync();

                    return Ok();
                }
                else
                    return this.StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }
        }

        [HttpGet("unreadMessages")]
        public async Task<ActionResult<int>> GetNumberOfUnreadMessages()
        {
            try
            {
                string userIdFromString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userIdFrom = -1;

                if (!String.IsNullOrEmpty(userIdFromString))
                {
                    userIdFrom = int.Parse(userIdFromString);

                    var messages = await _repository.GetMessagesByUserAsync(userIdFrom);
                    int numberOfUneradMessages = messages
                        .Where(m => m.UserToId == userIdFrom && m.isRead == false)
                        .Count();

                    return numberOfUneradMessages;
                }
                else
                    return this.StatusCode(StatusCodes.Status404NotFound);
            }
            catch(Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }
        }
    }
}
