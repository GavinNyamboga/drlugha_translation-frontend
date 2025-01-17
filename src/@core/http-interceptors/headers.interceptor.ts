import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpInterceptor,
	HttpErrorResponse
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import { environment } from "environments/environment";

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService, private router: Router) { }

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		const token = this.auth.loggedIn();
		const isExternalUrl = !(req.url.includes(environment.apiUrl) || req.url.includes("localhost"));

		if (token && !isExternalUrl) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${this.auth.getToken()}`
				}
			});
		}

		return next.handle(req).pipe(
			catchError((err) => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 401) {
						this.auth.logout();
						this.router.navigate(["/auth/login"]);
					}
				}
				return throwError(err);
			})
		);
	}
}
