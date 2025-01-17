import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {UserService} from "../../services/auth/user.service";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
	currentUser: any;


	constructor(
    private router: Router,
    private UserService: UserService,
    private authService: AuthService
	) { }

	ngOnInit(): void {
		this.authService.getCurrentUser();
		this.getCurrentUser();

	}


	id = this.authService.getCurrentUser();
	userId = parseInt(this.id);

	getCurrentUser() {
		this.UserService.fetchUserById(this.userId).subscribe({
			next: (response) => {
				this.currentUser = response;

			},
			error: (error) => {
				error.message;
			}
		});
	}
	back() {
		this.router.navigate(["/user"]);
	}
	logoutUser() {
		this.router.navigate(["/auth"]);
	}

	clearToken() {
		localStorage.clear();
	}
	changepassword() {
		this.router.navigate(["/changepassword"]);
		// console.log("this is an error")
	}
}
