import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	public loggedIn() {
		return !!localStorage.getItem("token") && !!localStorage.getItem("currentUser");
	}

	public getToken() {
		return localStorage.getItem("token");
	}

	public getCurrentUser() {
		return localStorage.getItem("userId");
	}

	public logout() {
		localStorage.clear();
	}
  
}
