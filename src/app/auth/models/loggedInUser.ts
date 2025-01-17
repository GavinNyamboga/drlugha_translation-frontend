import { Role } from "./role";

export class LoggedInUser {
	userId: number;
	username: string;
	email: string;
	phoneNo: string;
	token?: string;
	roles: Role;

	constructor(user: LoggedInUser) {
		this.userId = user.userId;
		this.username = user.username;
		this.email = user.email;
		this.phoneNo = user.phoneNo;
		this.token = user.token;
		this.roles = user.roles;
	}
}
