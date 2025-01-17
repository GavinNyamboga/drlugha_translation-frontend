import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../../@core/models/user.model";
import {AuthenticationService} from "../../../../auth/service";

@Component({
	selector: "app-user-form",
	templateUrl: "./user-form.component.html",
	styleUrls: ["./user-form.component.scss"]
})
export class UserFormComponent implements OnInit {
	@Input() user: User;
	@Input() mode: "create" | "edit" = "create";
	@Output() formSubmitted: EventEmitter<User> = new EventEmitter<User>();
	userForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private authenticationService: AuthenticationService) { }

	ngOnInit(): void {
		this.initiateUserForm();
	}

	private initiateUserForm() {
		this.userForm = this.fb.group({
			username: [
				{
					value: this.user?.username,
					disabled: !this.isCreateMode
				},
				Validators.required],
			email: [this.user?.email, [Validators.required, Validators.email]],
			phoneNo: [this.user?.phoneNo, Validators.required],
			password: ["", this.isCreateMode ? Validators.required : null],
			roles: [this.user?.roles, Validators.required],
		});
	}

	get f(): { [key: string]: AbstractControl} {
		return this.userForm.controls;
	}

	get isCreateMode(): boolean {
		return this.mode === "create";
	}

	get isAdmin(): boolean {
		return this.authenticationService.isAdmin;
	}

	submitForm() {
		this.userForm.markAllAsTouched();

		if (this.userForm.invalid) {
			return;
		}

		this.formSubmitted.emit(this.userForm.value);
	}
}
