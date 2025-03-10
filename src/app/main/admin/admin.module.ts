import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CreateBatchComponent } from "./components/create-batch/create-batch.component";
import { LanguageStatisticsComponent } from './language-statistics/language-statistics.component';

const routes: Routes = [
	{
		path: "",
		component: AdminComponent,
		children: [
			{
				path: "batch",
				loadChildren: () => import("./batch/batch.module").then(m => m.BatchModule)
			},
			{
				path: "language-statistics",
				loadChildren: () => import("./language-statistics/language-statistics.module").then(m => m.LanguaguageStatisticsModule)
			},
			{
				path: "statistics",
				loadChildren: () => import("./statistics/statistics.module").then(m => m.StatisticsModule)
			},
			{
				path: "",
				redirectTo: "batch",
				pathMatch: "full"
			}
		]
	},
];

@NgModule({
	declarations: [
		AdminComponent,
		CreateBatchComponent
	],
	exports: [
		CreateBatchComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		HttpClientModule,
		ReactiveFormsModule
	]
})
export class AdminModule { }
