import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {TextTranslateComponent} from "./text-translate.component";
import {ModeratorGuard} from "../../../@core/guards/moderator.guard";

const routes: Routes = [
	{
		path: "",
		component: TextTranslateComponent,
		children: [
			{
				path: "translate",
				loadChildren: () => import("./translate/translate.module").then(m => m.TranslateModule)
			},
			{
				path: "moderate",
				data: {
					page: "moderate",
				},
				loadChildren: () => import("./moderate/moderate.module").then(m => m.ModerateModule),
				canActivate: [ModeratorGuard],
			},
			{
				path: "expert-review",
				data: {
					page: "expert-review"
				},
				loadChildren: () => import("./moderate/moderate.module").then(m => m.ModerateModule),
				canActivate: [ModeratorGuard]
			},
		],
	}
];

@NgModule({
	declarations: [
		TextTranslateComponent
	],
	exports: [
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule
	]
})
export class TextTranslateModule { }
