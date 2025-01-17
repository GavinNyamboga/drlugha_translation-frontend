import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import {AuthenticationService} from "../../../../auth/service";
import {ToastrService} from "ngx-toastr";

@Component({
	selector: "app-auth-login",
	templateUrl: "./auth-login.component.html",
	styleUrls: ["./auth-login.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class AuthLoginComponent implements OnInit {
	//  Public
	public coreConfig: any;
	public loginForm: UntypedFormGroup;
	public loading = false;
	public submitted = false;
	public returnUrl: string;
	public error = "";
	public passwordTextType: boolean;
	role: string;

	// Private
	private _unsubscribeAll: Subject<any>;

	constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
	private authService : AuthenticationService,
	private toastr: ToastrService,
	private router: Router,) {
		this._unsubscribeAll = new Subject();

		// Configure the layout
		this._coreConfigService.config = {
			layout: {
				navbar: {
					hidden: true
				},
				menu: {
					hidden: true
				},
				footer: {
					hidden: true
				},
				customizer: false,
				enableLocalStorage: false
			}
		};

		this.loginForm = this._formBuilder.group({
			username:["",[Validators.required]],
			password:["" ,[Validators.required]]
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}

	/**
   * Toggle password
   */
	togglePasswordTextType() {
		this.passwordTextType = !this.passwordTextType;
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		// Login
		this.loading = true;

		// redirect to home page
		setTimeout(() => {
			this._router.navigate(["/"]);
		}, 100);
	}

	login() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		// Login
		this.loading = true;

		localStorage.clear();
		this.authService.login(this.loginForm.value)
			.subscribe(
				(response) => {
					this.loading = false;
					this.role = response.userDetails.roles;

					localStorage.setItem("token", response.token);
					this.authService.storeUserDetailsToLocalStorage(response.userDetails);
					this.toastr.success("Successful login");
					this.router.navigate(["/"]);
				},
				(error) =>{
					this.loading = false;
					this.toastr.error(error.message);
				}

			);
	}

	// Lifecycle Hooks
	// -----------------------------------------------------------------------------------------------------

	/**
   * On init
   */
	ngOnInit(): void {
		// get return url from route parameters or default to '/'
		this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

		// Subscribe to config changes
		this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
			this.coreConfig = config;
		});
	}

	/**
   * On destroy
   */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}
}
