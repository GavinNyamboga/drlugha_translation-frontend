import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../../app/auth/service";

@Injectable({
	providedIn: "root" 
})
export class ModeratorGuard implements CanActivate {

	constructor(
	private authenticationService: AuthenticationService,
	private router: Router
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authenticationService.isModerator || this.authenticationService.isAdmin) {
			return true;
		} else {
			this.router.parseUrl("text-translate/translate");
			return false;
		}
	}
  
}
