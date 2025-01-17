import { Component, Input, OnInit} from "@angular/core";
import {BatchDetails} from "../../../../models/batch/batch-details";
import {AssignmentsProgressConfigService} from "../../../../services/assignments/assignments-progress-config.service";

@Component({
	selector: "app-sidebar-link",
	templateUrl: "./sidebar-link.component.html",
	styleUrls: ["./sidebar-link.component.scss"]
})
export class SidebarLinkComponent implements OnInit {
	@Input() batchDetail: BatchDetails;

	defaultUrl$ = this.assignmentsConfig.defaultUrl$;
	badgeLabels$ = this.assignmentsConfig.badgeLabels$;
	completed: boolean;
	constructor(private assignmentsConfig: AssignmentsProgressConfigService) { }

	ngOnInit(): void {
		this.completed = this.assignmentsConfig.isBatchDetailCompleted(this.batchDetail);
	}

}
