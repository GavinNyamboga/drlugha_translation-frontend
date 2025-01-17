import { Component, OnInit } from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../@core/services/auth/user.service";

@Component({
	selector: "app-create-new-user",
	templateUrl: "./create-new-user.component.html",
	styleUrls: ["./create-new-user.component.scss"]
})
export class CreateNewUserComponent implements OnInit {
	createUserForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private toastService: ToastrService) { }

	ngOnInit(): void {
		this.initiateFormCreateUserForm();
	}

	initiateFormCreateUserForm() {
		this.createUserForm = this.fb.group({
			username: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			phoneNo: ["", Validators.required],
			password: ["", Validators.required],
			roles: ["", Validators.required],
		});
	}

	get f(): { [key: string]: AbstractControl} {
		return this.createUserForm.controls;
	}

	createUser(formValue) {
		this.userService.registerUser(formValue).subscribe({
			next: ( ) => {
				this.toastService.success("User created successfully");
				this.router.navigate(["/main/users/reports"]);
			},
			error: (error) => {
				const message = error?.error?.message || "Failed to create new user";
				this.toastService.error(message, "Error");
			}
		});
	}
}
