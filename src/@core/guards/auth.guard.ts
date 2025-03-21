import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";

@Injectable({ 
	providedIn: "root"
})
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate(): boolean {
		if (this.auth.loggedIn()) {
			return true;
		} else {
			this.router.navigate(["/pages/authentication/login-v2"]);
			return false;
		}
	}
  
}
