import {NgModule} from "@angular/core";
import {DownloadAudioFilesComponent} from "./components/download-audio-files/download-audio-files.component";
import {CommonModule} from "@angular/common";
import {DownloadProgressChartComponent} from "./components/download-progress-chart/download-progress-chart.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {NgbProgressbarModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	declarations: [
		DownloadAudioFilesComponent,
		DownloadProgressChartComponent
	],
	imports: [
		CommonModule,
		NgApexchartsModule,
		NgbProgressbarModule
	],
	exports: [DownloadAudioFilesComponent]
})
export class DownloadAudioHelperModule {}
