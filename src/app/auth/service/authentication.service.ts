import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

import {environment} from "environments/environment";
import {Role, LoggedInUser} from "app/auth/models";
import {ToastrService} from "ngx-toastr";
import {EncryptionService} from "../../../@core/services/encryption.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
	//public
	public currentUser: Observable<LoggedInUser>;

	//private
	private currentUserSubject: BehaviorSubject<LoggedInUser>;

	/**
	 *
	 * @param {HttpClient} _http
	 * @param {ToastrService} _toastrService
	 * @param encryption
	 */
	constructor(private _http: HttpClient, private _toastrService: ToastrService, private encryption: EncryptionService) {
		const currentUser: LoggedInUser = JSON.parse(localStorage.getItem("currentUser")) || null;
		this.currentUserSubject = new BehaviorSubject<LoggedInUser>(currentUser ? new LoggedInUser(currentUser) : null);
		this.currentUser = this.currentUserSubject.asObservable();
	}

	// getter: currentUserValue
	public get currentUserValue(): LoggedInUser {
		return this.currentUserSubject.value;
	}

	public get currentUserId() {
		return localStorage.getItem("userId");
	}
	public setCurrentUser() {
		this._http.get(environment.apiUrl + "fetch/user/"+this.currentUserId).subscribe((user: LoggedInUser) => {
			this.storeUserDetailsToLocalStorage(user);
		});
	}

	/**
   *  Confirms if user is admin
   */
	get isAdmin() {
		return this.currentUser && this.currentUserSubject.value.roles === Role.Admin;
	}

	/**
   *  Confirms if user is moderator
   */
	get isModerator() {
		return this.currentUser && this.currentUserSubject.value.roles === Role.Moderator;
	}

	get isViewer() {
		return this.currentUser && this.currentUserSubject.value.roles === Role.Viewer;
	}

	get isTranslator() {
		return this.currentUser && this.currentUserSubject.value.roles === Role.User;
	}

	/**
	 * User login
	 *
	 * @returns user
	 * @param payload
	 */
	login(payload: any): Observable<any> {
		return this._http.post(environment.apiUrl + "authenticate",payload);
	}

	/**
   * User logout
   *
   */
	logout() {
		localStorage.clear();
		this.currentUserSubject.next(null);
	}

	storeUserDetailsToLocalStorage(user: LoggedInUser) {
		localStorage.setItem("userId", JSON.stringify(user.userId));
		localStorage.setItem("currentUser", JSON.stringify(user));
		this.currentUserSubject.next(user);
	}
}
