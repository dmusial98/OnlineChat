using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using OnlineChat.Data;
using OnlineChat.Data.Entities;
using OnlineChat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IOnlineChatRepository _repository;
        private readonly IMapper _mapper;
        private readonly LinkGenerator _linkGenerator;

        public MessagesController(IOnlineChatRepository repository, IMapper mapper, LinkGenerator linkGenerator)
        {
            _repository = repository;
            _mapper = mapper;
            _linkGenerator = linkGenerator;
        }

        [HttpGet/*, Authorize*/]
        public async Task<ActionResult<MessageModel[]>> Get()
        {
            try
            {
                var result = await _repository.GetAllMessagesAsync();
                return _mapper.Map<MessageModel[]>(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MessageModel>> Get(int id)
        {
            try
            {
                var product = await _repository.GetMessageByIdAsync(id);

                if (product == null) return NotFound();

                return _mapper.Map<MessageModel>(product);

            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{e.Message}");
            }
        }


        [HttpGet("byUser")]
        public async Task<ActionResult<MessageModel[]>> GetByUser(int userId)
        {
            try
            {
                var products = await _repository.GetMessagesByUserAsync(userId);

                if (products == null)
                    return NotFound();

                return _mapper.Map<MessageModel[]>(products);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{e.Message}");
            }
        }

        [HttpPost/*, Authorize*/]
        public async Task<ActionResult<MessageModel>> Post(MessageModel model)
        {
            try
            {
                var message = _mapper.Map<Message>(model);
                _repository.Add(message);
                if (await _repository.SaveChangesAsync())
                {
                    return Created($"/api/messages/{message.Id}", _mapper.Map<MessageModel>(message));
                }
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{id:int}")]
        //[Authorize]
        public async Task<ActionResult<MessageModel>> Put(int id, MessageModel model)
        {
            try
            {
                var oldProduct = await _repository.GetMessageByIdAsync(id);
                if (oldProduct == null) return NotFound($"Could not find message with id equal {id}");

                _mapper.Map(model, oldProduct);

                if (await _repository.SaveChangesAsync())
                    return _mapper.Map<MessageModel>(oldProduct);
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }

        [HttpDelete("{id:int}")]
        //[Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var oldProduct = await _repository.GetMessageByIdAsync(id);
                if (oldProduct == null) return NotFound($"Could not find message with id equal {id}");

                _repository.Delete(oldProduct);

                if (await _repository.SaveChangesAsync())
                    return Ok();
            }
            catch (Exception exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{exception.Message}");
            }

            return BadRequest();
        }
    }
}
