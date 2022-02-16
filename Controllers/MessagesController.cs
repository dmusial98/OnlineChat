using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using OnlineChat.Data;
using OnlineChat.Data.Entities;
using OnlineChat.Models;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OnlineChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IOnlineChatRepository _repository;
        private readonly IMapper _mapper;
        private readonly LinkGenerator _linkGenerator; //TODO

        public MessagesController(IOnlineChatRepository repository, IMapper mapper, LinkGenerator linkGenerator)
        {
            _repository = repository;
            _mapper = mapper;
            _linkGenerator = linkGenerator;
        }

        [HttpGet, Authorize]
        public async Task<ActionResult<MessageModel[]>> Get()
        {
            try
            {
                string role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role == "admin")
                {

                    var result = await _repository.GetAllMessagesAsync();
                    return _mapper.Map<MessageModel[]>(result);
                }
                else
                    return this.StatusCode(StatusCodes.Status403Forbidden);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<MessageModel>> Get(int id)
        {
            try
            {
                string role = User.FindFirst(ClaimTypes.Role)?.Value;
                var message = await _repository.GetMessageByIdAsync(id);
                string userFromIdString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userFromId = -1;

                if (role == "admin" ||
                    (int.TryParse(userFromIdString, out userFromId) && (message.UserFromId == userFromId || message.UserToId == userFromId)))
                {

                    if (message == null) return NotFound();

                    return _mapper.Map<MessageModel>(message);
                }
                else
                    return this.StatusCode(StatusCodes.Status403Forbidden);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{e.Message}");
            }
        }


        [HttpGet("byUser"), Authorize]
        public async Task<ActionResult<MessageModel[]>> GetByUser(int userId)
        {
            try
            {
                string userFromIdString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userFromId = -1;

                if (int.TryParse(userFromIdString, out userFromId))
                {
                    var messages = await _repository.GetMessagesByUsersAsync(userId, userFromId);
                    if (messages == null)
                        return NotFound();

                    return _mapper.Map<MessageModel[]>(messages);
                }
                else
                    return this.StatusCode(StatusCodes.Status404NotFound);

                
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{e.Message}");
            }
        }

        [HttpGet("lastMsgBetweenUsers"), Authorize]
        public async Task<ActionResult<MessageModel>> GetLastMessageBetweenTwoUsers(int userId)
        {
            try
            {
                string userIdFromString = User.FindFirst(ClaimTypes.Sid)?.Value;
                int userIdFrom = -1;

                if (int.TryParse(userIdFromString, out userIdFrom))
                {
                    var message = await _repository.GetLastMessageBetweenTwoUsersAync(userId, userIdFrom);
                    if (message == null)
                        return NotFound();

                    return _mapper.Map<MessageModel>(message);
                }
                else
                    return this.StatusCode(StatusCodes.Status404NotFound);


            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{e.Message}");
            }
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<MessageModel>> Post(MessageModel model)
        {
            try
            {
                string userIdFromString = User.FindFirst(ClaimTypes.Sid)?.Value;

                if (!String.IsNullOrEmpty(model.Content) && model.UserToId >= 0 && !String.IsNullOrEmpty(userIdFromString))
                {
                    var message = _mapper.Map<Message>(model);
                    message.UserFromId = int.Parse(userIdFromString);
                    message.SendTime = DateTime.Now;

                    _repository.Add(message);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Created($"/api/messages/{message.Id}", _mapper.Map<MessageModel>(message));
                    }
                }
                else
                {
                    return this.StatusCode(StatusCodes.Status406NotAcceptable, "lack of content of message or userToId.");
                }
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        //[HttpPut("{id:int}")]
        //[Authorize]
        //public async Task<ActionResult<MessageModel>> Put(int id, MessageModel model)
        //{
        //    //TODO: Only message's author can modify it

        //    try
        //    {
        //        var message = await _repository.GetMessageByIdAsync(id, withTracking: true);
        //        string userFromIdString = User.FindFirst(ClaimTypes.Sid)?.Value;
        //        int userFromId = -1;

        //        if (message == null)
        //            return NotFound($"Could not find message with id equals {id}");
        //        else if (int.TryParse(userFromIdString, out userFromId) && message.UserFromId == userFromId)
        //        {
        //            if (model.Id > 0 && !String.IsNullOrEmpty(model.Content) && model.UserToId == message.UserToId && model.UserFromId == message.UserFromId)
        //            {
        //                _mapper.Map(model, message);

        //                if (await _repository.SaveChangesAsync())
        //                    return _mapper.Map<MessageModel>(message);
        //            }
        //            else return this.StatusCode(StatusCodes.Status406NotAcceptable);
        //        }
        //        else
        //            return this.Forbid();
        //    }
        //    catch (Exception exception)
        //    {
        //        return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
        //    }

        //    return BadRequest();
        //}

        //    [HttpDelete("{id:int}")]
        //    [Authorize]
        //    public async Task<IActionResult> Delete(int id)
        //    {
        //        //TODO: Only author can delete message

        //        try
        //        {
        //            var oldProduct = await _repository.GetMessageByIdAsync(id, withTracking: true);
        //            if (oldProduct == null) return NotFound($"Could not find message with id equal {id}");

        //            _repository.Delete(oldProduct);

        //            if (await _repository.SaveChangesAsync())
        //                return Ok();
        //        }
        //        catch (Exception exception)
        //        {
        //            return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
        //        }

        //        return BadRequest();
        //    }
    }
}
