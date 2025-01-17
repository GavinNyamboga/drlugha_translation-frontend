import {Component, Input, OnInit} from "@angular/core";
import {ReviewedSentence} from "../../../../../@core/models/sentence/reviewed-sentence";
import {BatchType} from "../../../../../@core/enums/batch-type";

@Component({
	selector: "app-reviewed-sentences",
	templateUrl: "./reviewed-sentences.component.html",
	styleUrls: ["./reviewed-sentences.component.scss"]
})
export class ReviewedSentencesComponent implements OnInit {
	@Input() reviewedSentences: ReviewedSentence[] = [];
	@Input() language: string;
	@Input() batchType: BatchType;

	constructor() { }

	ngOnInit(): void {
	}

	get hasRejectedSentences(): boolean {
		return this.reviewedSentences.some(reviewedSentence => reviewedSentence.accepted === false);
	}

	protected readonly BatchType = BatchType;
}
