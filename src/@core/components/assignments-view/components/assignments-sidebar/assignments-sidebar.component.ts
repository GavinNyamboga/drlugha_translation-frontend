import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from "@angular/core";
import {BatchDetailAssignments} from "../../../../models/batch/batch-detail-assignments";
import {AssignmentsProgressConfigService} from "../../../../services/assignments/assignments-progress-config.service";

@Component({
	selector: "app-assignments-sidebar",
	templateUrl: "./assignments-sidebar.component.html",
	styleUrls: ["./assignments-sidebar.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AssignmentsSidebarComponent implements OnInit {
	@Input() batchDetails: BatchDetailAssignments;
	@Input() defaultUrl: string;
	@Output() sidebarToggle = new EventEmitter<void>();

	showTranscriptionAssignments$ = this.assignmentsConfig.showTranscriptionAssignments$;

	constructor(private assignmentsConfig: AssignmentsProgressConfigService) { }

	ngOnInit(): void {
	}

	toggleSidebar() {
		this.sidebarToggle.emit();
	}

}
