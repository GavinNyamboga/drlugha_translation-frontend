import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";

@Injectable({
	providedIn: "root"
})
export class LoginPageGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}

	canActivate(): boolean {
		if (!this.auth.loggedIn()) {
			return true;
		} else {
			this.router.navigate(["/main"]);
			return false;
		}
	}

}
