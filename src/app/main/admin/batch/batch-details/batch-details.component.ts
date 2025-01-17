import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {User} from "../../../../../@core/models/user.model";
import {BatchService} from "../../../../../@core/services/batch/batch.service";
import {UserService} from "../../../../../@core/services/auth/user.service";
import {LanguageService} from "../../../../../@core/services/language/language.service";
import {Language} from "../../../../../@core/models/language/language";
import {BatchType} from "../../../../../@core/enums/batch-type";

@Component({
	selector: "app-batch-details",
	templateUrl: "./batch-details.component.html",
	styleUrls: ["./batch-details.component.scss"]
})
export class BatchDetailsComponent implements OnInit {
	users: User[] = [];
	batchId: number;
	languages: Language[] = [];
	selectedLanguage: Language;
	batchDetails: any[] = [];
	selectedBatchDetail: any;
	loadingBatchDetails = true;
	batchType: BatchType;

	constructor(
      private userService: UserService,
      private batchService: BatchService,
      private activatedRoute: ActivatedRoute,
      private languageService: LanguageService) { }

	ngOnInit(): void {
		this.batchId = this.activatedRoute.snapshot.params.batchId;
		this.batchType = this.activatedRoute.snapshot.queryParams.type || BatchType.TEXT;

		this.getUsers();
		this.getBatchDetails();
		this.getLanguages();
	}

	private getUsers(): void {
		this.userService.fetchAllUsers().subscribe(
			(res) => {
				this.users = res;
			}
		);
	}

	private getBatchDetails(): void {
		this.batchService.getBatchDetails(this.batchId).subscribe(
			(res) => {
				this.loadingBatchDetails = false;
				this.batchDetails = res;
				this.updateSelectedBatchDetail();
			},
			() => {
				this.loadingBatchDetails = false;
			}
		);
	}

	updateSelectedBatchDetail(): void {
		this.selectedBatchDetail = this.batchDetails.find((batchDetail) => batchDetail.language === this.selectedLanguage?.languageId);
	}

	private getLanguages(): void {
		this.languageService.getLanguages().subscribe(
			(languages) => {
				this.languages = languages;

				this.selectedLanguage = this.languages[0];
			}
		);
	}

	updateSelectedLanguage($event: MatTabChangeEvent): void {
		this.selectedLanguage =this.languages.find((language) => language.name === $event.tab.textLabel);
		this.updateSelectedBatchDetail();
	}

	addBatchDetails(batchDetail: any): void  {
		this.getBatchDetails();
	}
}
