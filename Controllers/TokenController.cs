using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using OnlineChat.Models;
using OnlineChat.Auth;
using OnlineChat.Data;
using System.Threading.Tasks;

namespace webapplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IOnlineChatRepository _repository;
        readonly ITokenService tokenService;

        public TokenController(IOnlineChatRepository repository, ITokenService tokenService)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            this.tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<ActionResult> Refresh(TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;

            var principal = tokenService.GetPrincipalFromExpiredToken(accessToken);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = await _repository.GetUserByLoginAsync(username, withTracking: true);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid client request");
            }

            var newAccessToken = tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _repository.SaveChangesAsync();

            return new ObjectResult(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }

        [HttpPost, Authorize]
        [Route("revoke")]
        public async Task<ActionResult> Revoke()
        {
            var username = User.Identity.Name;

            var user = await _repository.GetUserByLoginAsync(username, withTracking: true);
            if (user == null) return BadRequest();

            user.RefreshToken = null;

            await _repository.SaveChangesAsync(); 

            return NoContent();
        }

    }
}