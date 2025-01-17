import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ModerateComponent} from "./moderate.component";
import {SentencesToModerateComponent} from "./sentences-to-moderate/sentences-to-moderate.component";

const routes: Routes = [
	{
		path: "",
		component: ModerateComponent,
		children: [
			{
				path: "sentences",
				component: SentencesToModerateComponent
			},
			{
				path: "",
				redirectTo: "sentences",
				pathMatch: "full"
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})

export class ModerateRoutingModule {}
