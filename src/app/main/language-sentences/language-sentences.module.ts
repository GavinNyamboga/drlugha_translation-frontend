import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {LanguageSentencesComponent} from "./language-sentences.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";
import {AudioPlayerModule} from "../../../@core/components/audio-player/audio-player.module";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "../../../@core/common.module";
import {DownloadAudioHelperModule} from "../../../@core/components/download-audio-helper/download-audio-helper.module";

const routes: Routes = [
	{
		path: "",
		component: LanguageSentencesComponent,
	}
];

@NgModule({
	declarations: [
		LanguageSentencesComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgSelectModule,
		ReactiveFormsModule,
		AudioPlayerModule,
		NgbPaginationModule,
		CoreCommonModule,
		DownloadAudioHelperModule
	]
})
export class LanguageSentencesModule { }
