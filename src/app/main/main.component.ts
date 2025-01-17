import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../auth/service";

@Component({
	selector: "app-main",
	templateUrl: "./main.component.html",
})
export class MainComponent implements OnInit {
	constructor(private authenticationService: AuthenticationService) {}

	ngOnInit() {
		this.authenticationService.setCurrentUser();
	}
}
