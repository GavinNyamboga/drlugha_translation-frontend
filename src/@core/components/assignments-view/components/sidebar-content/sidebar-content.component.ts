import {Component, Input, OnInit} from "@angular/core";
import {slideInOutAnimation} from "../../../../animations/slide-in-out";
import {AssignmentsProgressConfigService} from "../../../../services/assignments/assignments-progress-config.service";

@Component({
	selector: "app-sidebar-content",
	templateUrl: "./sidebar-content.component.html",
	styleUrls: ["./sidebar-content.component.scss"],
	animations: [
		slideInOutAnimation
	]
})
export class SidebarContentComponent implements OnInit {
	@Input() title: string;
	showCount$ = this.progressCount.showCount$;
	currentIndex$ = this.progressCount.currentIndex$;
	totalCount$ = this.progressCount.totalCount$;

	constructor(private progressCount: AssignmentsProgressConfigService) { }

	ngOnInit(): void {
	}

}
