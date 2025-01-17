import {Component} from "@angular/core";
import {Location} from "@angular/common";

@Component({
	selector: "app-text-translate",
	templateUrl: "./text-translate.component.html",
	styleUrls: ["./text-translate.component.scss"]
})
export class TextTranslateComponent {

	constructor(private location: Location) {}

	back() {
		this.location.back();
	}
}
