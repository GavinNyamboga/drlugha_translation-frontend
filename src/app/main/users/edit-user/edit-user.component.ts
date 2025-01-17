import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { finalize, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Location} from "@angular/common";
import {User} from "../../../../@core/models/user.model";
import {UserService} from "../../../../@core/services/auth/user.service";

@Component({
	selector: "app-edit-user",
	templateUrl: "./edit-user.component.html",
	styleUrls: ["./edit-user.component.scss"]
})
export class EditUserComponent implements OnInit, OnDestroy {
	private userId: number;
	private destroy$ = new Subject<void>();
	user: User;
	updatingUser = false;

	constructor(
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private toastService: ToastrService,
		private location: Location) { }

	ngOnInit(): void {
		this.userId = this.activatedRoute.snapshot.params.userId;
		this.fetchUser();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private fetchUser() {
		this.userService.fetchUserById(this.userId)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.user = response;
				},
				error: () => {
					this.toastService.error("Failed to fetch user", "Error");
				}
			});
	}

	updateUserDetails(formValue) {
		this.updatingUser = true;
		this.userService.updateUser(formValue, this.userId)
			.pipe(
				takeUntil(this.destroy$),
				finalize(() => this.updatingUser = false),
			)
			.subscribe({
				next: () => {
					this.toastService.success("User updated successfully");
					this.navigateBack();
				},
				error: (error) => {
					const message = error?.error?.message || "Failed to update user";
					this.toastService.error(message, "Error");
				}
			});
	}

	navigateBack() {
		this.location.back();
	}
}
