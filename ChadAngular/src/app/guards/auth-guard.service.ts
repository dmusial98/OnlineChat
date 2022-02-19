import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router, private http: HttpClient) { }

  async canActivate() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if (!isRefreshSuccess) {
      this.router.navigate(["login"]);
    }
    return isRefreshSuccess;
  }

  async tryRefreshingTokens(token: string | null): Promise<boolean> {
    // Try refreshing tokens using refresh token
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    }
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    let isRefreshSuccess: boolean;
    try {
      const response = await this.http.post("https://onlinechat.azurewebsites.net/api/token/refresh", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        observe: 'response'
      }).toPromise();
      // If token refresh is successful, set new tokens in local storage.
      const newToken = (<any>response).body.accessToken;
      const newRefreshToken = (<any>response).body.refreshToken;
      localStorage.setItem("jwt", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      isRefreshSuccess = true;
    }
    catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }

  getIdFromJWT() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      var decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
    }
  }

}
