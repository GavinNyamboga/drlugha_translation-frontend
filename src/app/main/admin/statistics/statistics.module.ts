import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {StatisticsComponent} from "./statistics.component";
import {NgbDatepickerModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "../../../../@core/common.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
	{
		path: "",
		component: StatisticsComponent
	}
];

@NgModule({
	declarations: [
		StatisticsComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbDatepickerModule,
		CoreCommonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		NgbNavModule
	]
})
export class StatisticsModule { }
