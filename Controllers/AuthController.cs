using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using OnlineChat.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Routing;
using Microsoft.IdentityModel.Tokens;
using WebStore.Auth;
using OnlineChat.Models;
using OnlineChat.Data.Entities;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IOnlineChatRepository _repository;
        private readonly IMapper _mapper;
        private readonly LinkGenerator _linkGenerator;
        private readonly ITokenService _tokenService;

        public AuthController(IOnlineChatRepository repository, IMapper mapper, ITokenService tokenService, LinkGenerator linkGenerator)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            _mapper = mapper ?? throw new ArgumentException(nameof(mapper));
            _linkGenerator = linkGenerator ?? throw new ArgumentException(nameof(linkGenerator));
        }

        [HttpPost, Route("login")]
        public async Task<ActionResult> Login([FromBody] UserModel loginModel)
        {
            try
            {
                if (loginModel == null)
                {
                    return BadRequest("Invalid client request");
                }

                var user = await _repository.GetUserByLoginAndPasswordAsync(
                    loginModel.Login, loginModel.Password);

                if (user == null)
                    return Unauthorized();

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, loginModel.Login),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Sid, user.Id.ToString())
                };

                var accessToken = _tokenService.GenerateAccessToken(claims);
                var refreshToken = _tokenService.GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(30);

                await _repository.SaveChangesAsync();

                return Ok(new
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{ex.Message}");
            }
        }

        [HttpPost, Authorize]
        [Route("revoke")]
        public async Task<ActionResult> Revoke(UserModel model)
        {
            var username = model.Login;
            var user = await _repository.GetUserByLoginAsync(username);
            if (user == null) return BadRequest();
            user.RefreshToken = null;
            await _repository.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost, Route("register")]
        public async Task<ActionResult> Register([FromBody] UserModel registerModel)
        {
            try
            {
                var user = _mapper.Map<User>(registerModel);
                var theSameUserByLogin = await _repository.GetUserByLoginAsync(user.Login);
                var theSameUserByEmail = await _repository.GetUserByEmailAsync(user.Email);

                if (theSameUserByLogin == null && theSameUserByEmail == null)
                {
                    _repository.Add(user);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Created($"/api/auth/register", _mapper.Map<UserModel>(user));
                    }
                }
                else
                    return this.StatusCode(StatusCodes.Status406NotAcceptable, "user with the same login or email exists.");
            }
            catch(Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"{e.Message}");
            }

            return BadRequest();
        }
    }
}
