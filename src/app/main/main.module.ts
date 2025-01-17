import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MainRoutingModule} from "./main-routing.module";
import {MainComponent} from "./main.component";
import { RecordAudioComponent } from "./components/record-audio/record-audio.component";
import {CoreCommonModule} from "../../@core/common.module";

@NgModule({
	declarations: [
		MainComponent,
		RecordAudioComponent
	],
	imports: [
		CommonModule,
		MainRoutingModule,
		CoreCommonModule
	],
	exports: [
		RecordAudioComponent
	]
})
export class MainModule {}
