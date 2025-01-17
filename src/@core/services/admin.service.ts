import { Injectable } from "@angular/core";
import {LoggedInUser} from "../../app/auth/models";

@Injectable({
	providedIn: "root",
})
export class AdminService {

	userDetails: any;
	constructor() {}

	isAdmin() {
		const currentUser: LoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
		return currentUser.roles == "ROLE_ADMIN";
	}
}
