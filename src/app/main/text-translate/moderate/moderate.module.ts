import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { SentencesToModerateComponent } from "./sentences-to-moderate/sentences-to-moderate.component";
import {ModerateRoutingModule} from "./moderate-routing.module";
import {ModerateComponent} from "./moderate.component";
import { ReviewedSentencesComponent } from "./reviewed-sentences/reviewed-sentences.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ModerateProgressConfigComponent} from "./components/moderate-progress-config/moderate-progress-config.component";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {CoreSidebarModule} from "../../../../@core/components";
import {AssignmentsViewModule} from "../../../../@core/components/assignments-view/assignments-view.module";
import {AudioPlayerModule} from "../../../../@core/components/audio-player/audio-player.module";

@NgModule({
	declarations: [
		ModerateComponent,
		SentencesToModerateComponent,
		ReviewedSentencesComponent,
		ModerateProgressConfigComponent
	],
	imports: [
		CommonModule,
		ModerateRoutingModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		CoreSidebarModule,
		AssignmentsViewModule,
		AudioPlayerModule
	],
	exports: [
		SentencesToModerateComponent
	],
})
export class ModerateModule {}
