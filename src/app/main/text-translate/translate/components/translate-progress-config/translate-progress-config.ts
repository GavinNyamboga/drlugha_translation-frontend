import {Component, inject} from "@angular/core";
import {
	AssignmentsProgressConfigService
} from "../../../../../../@core/services/assignments/assignments-progress-config.service";
import {BatchProgressStatus} from "../../../../../../@core/enums/batch-progress-status";

@Component({
	template: ""
})
export class TranslateProgressConfigComponent {
	private assignmentsConfig = inject(AssignmentsProgressConfigService);

	constructor() {
		this.assignmentsConfig.defaultUrl = "/main/text-translate/translate/sentences";
		this.assignmentsConfig.batchProgress = BatchProgressStatus.TRANSLATION;
		this.assignmentsConfig.badgeLabels = BatchProgressStatus.TRANSLATION;
	}
}
