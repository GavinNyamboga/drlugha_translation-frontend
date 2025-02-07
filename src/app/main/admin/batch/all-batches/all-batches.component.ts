import { Component, OnDestroy, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Batch } from "../../../../../@core/models/batch/batch";
import { BatchService } from "../../../../../@core/services/batch/batch.service";
import { BatchType } from "../../../../../@core/enums/batch-type";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BatchOrigin } from "@core/enums/batch-origin";

@Component({
	selector: "app-all-batches",
	templateUrl: "./all-batches.component.html",
	styleUrls: ["./all-batches.component.scss"]
})
export class AllBatchesComponent implements OnInit, OnDestroy {
	batchesOriginal: Batch[] = [];
	batches: Batch[] = [];
	createBatch: boolean;
	editBatchesForm: FormGroup;
	editableRows: { [key: number]: boolean } = {};
	pageSize = 25;
	page = 1;
	loadingBatches = true;
	selectedOption: BatchType = BatchType.TEXT;
	unsubscribe$ = new Subject<void>();
	selectedBatchOrigin: string | null = null;
	batchOrigins: { value: string; label: string }[] = [];


	constructor(
		private batchService: BatchService,
		private fb: FormBuilder,
		private toastr: ToastrService) { }

	ngOnInit(): void {
		this.getBatches();
		this.loadBatchOrigins();
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	getBatches(): void {
		this.loadingBatches = true;
		this.batches = [];
		this.unsubscribe$ = new Subject<void>();

		this.batchService.getBatches(this.selectedOption)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
				(res) => {
					this.loadingBatches = false;
					this.batchesOriginal = res;
					this.batches = [...this.batchesOriginal];
					this.initializeEditBatchesForm();
				},
				() => {
					this.loadingBatches = false;
				}
			);
	}

	private initializeEditBatchesForm(): void {
		this.editBatchesForm = this.fb.group({
			batches: this.fb.array([])
		});

		this.batches.forEach((batch) => {
			this.batchesFormArray.push(this.fb.group({
				batchNo: batch.batchNo,
				source: batch.source,
				description: batch.description,
				linkUrl: batch.linkUrl
			}));
		});
	}

	private get batchesFormArray(): FormArray {
		return this.editBatchesForm.get("batches") as FormArray;
	}

	createNewBatch() {
		this.createBatch = !this.createBatch;
	}

	reloadBatches() {
		this.getBatches();
		this.createBatch = false;
	}

	confirmDelete(batch: Batch) {
		Swal.fire({
			title: "Delete Batch?",
			text: "Are you sure you want to delete this batch?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
			reverseButtons: true,
			confirmButtonColor: "#d33",
		}).then((result) => {
			if (result.isConfirmed) {
				this.deleteBatch(batch.batchNo);
			}
		});
	}

	private deleteBatch(batchNo: number): void {
		this.batchService.deleteBatch(batchNo).subscribe(
			() => {
				this.toastr.success("Batch deleted successfully");
				this.getBatches();
			},
			() => {
				this.toastr.error("Error deleting batch");
			}
		);
	}

	activateRowEdit(batch: Batch) {
		this.editableRows[batch.batchNo] = !this.editableRows[batch.batchNo];
	}

	updateBatch(batchIndex: number, batch: Batch) {
		const batchForm = this.batchesFormArray.at(batchIndex) as FormGroup;

		this.batchService.updateBatch(batchForm.value).subscribe(
			() => {
				batch.source = batchForm.value.source;
				batch.description = batchForm.value.description;

				this.editableRows[batch.batchNo] = false;
				this.toastr.success("Batch updated successfully");
			},
			() => {
				this.toastr.error("Error updating batch");
			}
		);
	}

	updateTable($event) {
		this.selectedOption = $event.nextId;
		this.unsubscribe$.next();
		this.page = 1;
		this.getBatches();
		this.selectedBatchOrigin = null;
	}

	filterUpdate($event: KeyboardEvent) {
		this.page = 1;
		const filterValue = ($event.target as HTMLInputElement).value;
		this.batches = this.batchesOriginal.filter((batch) => batch.source.toLowerCase().includes(filterValue.toLowerCase()));
		this.initializeEditBatchesForm();
	}

	resetCurrentPage() {
		this.page = 1;
	}

	private loadBatchOrigins(): void {
		this.batchOrigins.push(
			{value: BatchOrigin.NORMAL, label:"Normal"},
			{value: BatchOrigin.FEEDBACK, label:"User Feedback"},
			{value: BatchOrigin.RE_REVIEW, label:"Re-review Batches"},
		)
	}

	applyFilters() {
		this.batches = [...this.batchesOriginal];

		this.batches = this.batches.filter(batch => {
			return !this.selectedBatchOrigin || batch.batchOrigin === this.selectedBatchOrigin;
		  });
	  }

	protected readonly BatchType = BatchType;
}
