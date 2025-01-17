import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModerateComponent } from "./moderate/moderate.component";
import { TranslateComponent } from "./translate/translate.component";
import { RouterModule, Routes } from "@angular/router";
import {OralTranslateComponent} from "./oral-translate.component";
import { BatchVoiceTranslationsComponent } from "./components/batch-voice-translations/batch-voice-translations.component";
import { SentencesToRecordComponent } from "./components/sentences-to-record/sentences-to-record.component";
import { AudiosToModerateComponent } from "./components/audios-to-moderate/audios-to-moderate.component";
import {SharedModule} from "../../../@core/shared/shared.module";
import {CoreSidebarModule} from "../../../@core/components";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {CoreCommonModule} from "../../../@core/common.module";
import {MainModule} from "../main.module";
import {AssignmentsViewModule} from "../../../@core/components/assignments-view/assignments-view.module";
import {ModerateModule} from "../text-translate/moderate/moderate.module";

const routes: Routes= [
	{
		path: "",
		component: OralTranslateComponent,
		children: [
			{
				path: "translate/:currentPage",
				component: TranslateComponent
			},
			{
				path: "moderate/:currentPage",
				component: ModerateComponent,
			}
		]
	}
];

@NgModule({
	declarations: [
		ModerateComponent,
		TranslateComponent,
		OralTranslateComponent,
		BatchVoiceTranslationsComponent,
		SentencesToRecordComponent,
		AudiosToModerateComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		CoreSidebarModule,
		PerfectScrollbarModule,
		CoreCommonModule,
		MainModule,
		AssignmentsViewModule,
		ModerateModule
	]
})
export class OralTranslateModule { }
