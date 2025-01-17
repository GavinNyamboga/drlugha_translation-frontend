import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import {AuthenticationService} from "../../app/auth/service";

@Injectable({
	providedIn: "root"
})
export class AdminGuard implements CanActivate {
	constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
	) {}

	canActivate(): boolean {
		if(this.authenticationService.isAdmin)
			return true;

		const userId = this.authenticationService.currentUserValue.userId;
		const canViewStatsByDefault = this.authenticationService.isModerator || this.authenticationService.isTranslator;
		if (canViewStatsByDefault) {
			this.router.navigateByUrl("/main/users/view/"+userId);
			return false;
		}

		this.router.navigateByUrl("/main/text-translate/translate");
		return false;
	}

}
