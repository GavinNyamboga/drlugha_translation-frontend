import {Component, Input} from "@angular/core";
import {BatchDetailAssignments} from "../../models/batch/batch-detail-assignments";

@Component({
	selector: "app-assignments-view",
	templateUrl: "./assignments-view.component.html",
	styleUrls: ["./assignments-view.component.scss"],
	host: { class: "translate-application" }
})
export class AssignmentsViewComponent {
	@Input() title: string;
	@Input() defaultUrl: string;
	@Input() batchDetails: BatchDetailAssignments;

	showSidebar: boolean;

	toggleSidebar() {
		this.showSidebar = !this.showSidebar;
	}

}
