import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BatchType} from "../../../../../@core/enums/batch-type";
import {BatchDetailProgressReport} from "../../../../../@core/models/batch/batch-detail-progress-report";
import {BatchService} from "../../../../../@core/services/batch/batch.service";
import {AuthenticationService} from "../../../../auth/service";

@Component({
	selector: "app-batch-details-statistics",
	templateUrl: "./batch-details-statistics.component.html",
	styleUrls: ["./batch-details-statistics.component.scss"]
})
export class BatchDetailsStatisticsComponent implements OnInit {
	@Input() language: string;
	@Input() batchDetailsStatus: string;
	@Input() batchType: BatchType;

	private batchDetailsId: number;

	public batchDetailsProgressReport: BatchDetailProgressReport;
	constructor(
		private activatedRoute: ActivatedRoute,
		private batchService: BatchService,
		private authenticationService: AuthenticationService) { }

	ngOnInit(): void {
		this.batchDetailsId = this.activatedRoute.snapshot.params.batchDetailsId;
		this.getProgressReportPerBatchDetail();
	}

	private getProgressReportPerBatchDetail() {
		this.batchService.getProgressReportPerBatchDetailsId(this.batchDetailsId).subscribe({
			next: (progressReport) => {
				this.batchDetailsProgressReport = progressReport;
			}
		});
	}

	get isAudioType(): boolean {
		return  this.batchType == BatchType.AUDIO;
	}

	get isAdmin(): boolean {
		return this.authenticationService.isAdmin;
	}
}
