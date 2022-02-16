using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using OnlineChat.Data;
using OnlineChat.Data.Entities;
using OnlineChat.Models;
using System;
using System.Linq;
using System.Security.Claims;
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


        [HttpGet, Authorize]
        public async Task<ActionResult<UserModel[]>> Get()
        {
            try
            {
                string role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role == "admin")
                {
                    var result = await _repository.GetAllUsersAsync();
                    return _mapper.Map<UserModel[]>(result);
                }
                else
                    return this.Forbid();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id:int}"), Authorize]
        public async Task<ActionResult<UserModel>> Get(int id)
        {
            try
            {
                string role = User.FindFirst(ClaimTypes.Role)?.Value;
                string userFromIdString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userFromId = -1;

                if (role == "admin" || (int.TryParse(userFromIdString, out userFromId) && userFromId == id))
                {
                    var result = await _repository.GetUserByIdAsync(id);
                    return _mapper.Map<UserModel>(result);
                }
                else
                    return this.Forbid();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        //[HttpPost, Authorize]
        //public async Task<ActionResult<UserModel>> Post(UserModel model)
        //{
        //    try
        //    {
        //        var user = _mapper.Map<User>(model);

        //        _repository.Add(user);
        //        if (await _repository.SaveChangesAsync())
        //        {
        //            return Created($"/api/users/{user.Id}", _mapper.Map<UserModel>(user));
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
        //    }

        //    return BadRequest();
        //}

        [HttpPut("{id:int}"), Authorize]
        public async Task<ActionResult<UserModel>> Put(int id, UserModel model)
        {
            try
            {
                string userFromIdString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userFromId = -1;
                string role = User.FindFirst(ClaimTypes.Role)?.Value;

                var user = await _repository.GetUserByIdAsync(id, withTracking: true);
                if (user == null) 
                    return NotFound($"Could not find user with id equal {id}");

                if ((role == "admin" || (int.TryParse(userFromIdString, out userFromId) && userFromId == id && id == user.Id)))
                {
                    User oldUser = new User
                    {
                        Id = user.Id,
                        Role = user.Role,
                        Login = user.Login,
                        Password = user.Password,
                        Email = user.Email,
                        RefreshToken = user.RefreshToken,
                        RefreshTokenExpiryTime = user.RefreshTokenExpiryTime
                    };

                    //user wants to change role from normal user to admin
                    if (oldUser.Role == "user" && model.Role == "admin" && role != "admin")
                        return this.Forbid();

                    //Id and Login cannot change
                    if (model.Id != oldUser.Id || model.Login != oldUser.Login)
                        return this.Forbid();
              
                    //cannot set new email for user from exists email in database
                    if(model.Email != oldUser.Email)
                    {
                        var userWithTheSameEmail = await _repository.GetUserByEmailAsync(model.Email);
                        if (userWithTheSameEmail is not null)
                            return this.Forbid();
                    }

                    _mapper.Map(model, user);
                    user.RefreshToken = oldUser.RefreshToken;
                    user.RefreshTokenExpiryTime = oldUser.RefreshTokenExpiryTime;

                    if (await _repository.SaveChangesAsync())
                        return _mapper.Map<UserModel>(user);
                }
                
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    try
        //    {
        //        var oldUser = await _repository.GetUserByIdAsync(id, withTracking: true);
        //        if (oldUser == null) return NotFound($"Could not find user with id equal {id}");

        //        _repository.Delete(oldUser);

        //        if (await _repository.SaveChangesAsync())
        //            return Ok();
        //    }
        //    catch (Exception exception)
        //    {
        //        return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
        //    }

        //    return BadRequest();
        //}

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

                    var messages = await _repository.GetMessagesByUsersAsync(userIdFrom, id, withTracking: true);
                    var newMessages = messages.Where(m => m.isRead == false);

                    bool wasChange = false;

                    foreach (var mess in newMessages)
                    {
                        if (!mess.isRead)
                        {
                            mess.isRead = true;
                            wasChange = true;
                        }
                    }
                        
                    if(wasChange)
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

        [HttpGet("unreadMessages"), Authorize]
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
