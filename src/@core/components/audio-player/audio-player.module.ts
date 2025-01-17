import {NgModule} from "@angular/core";
import {AudioPlayerComponent} from "./audio-player.component";
import {CommonModule} from "@angular/common";

@NgModule({
	declarations: [
		AudioPlayerComponent
	],
	imports: [
		CommonModule,
	],
	exports: [
		AudioPlayerComponent
	]
})
export class AudioPlayerModule {}
