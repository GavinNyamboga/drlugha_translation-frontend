import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { DragulaModule } from "ng2-dragula";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

import { CoreSidebarModule } from "@core/components";
import { CoreCommonModule } from "@core/common.module";
import {TranslateComponent} from "./translate.component";
import {SentencesToTranslateComponent} from "./sentences-to-translate/sentences-to-translate.component";
import {VerifyTextTranslationsComponent} from "./verify-text-translations/verify-text-translations.component";
import {AssignmentsViewModule} from "../../../../@core/components/assignments-view/assignments-view.module";
import {TranslateProgressConfigComponent} from "./components/translate-progress-config/translate-progress-config";



const routes: Routes = [
	{
		path: "",
		component: TranslateComponent,
		children: [
			{
				path: "sentences",
				component: SentencesToTranslateComponent
			},
			{
				path: "verify/:batchDetailsId",
				component: VerifyTextTranslationsComponent
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
	declarations: [
		TranslateComponent,
		SentencesToTranslateComponent,
		VerifyTextTranslationsComponent,
		TranslateProgressConfigComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		CoreCommonModule,
		CoreSidebarModule,
		NgSelectModule,
		DragulaModule.forRoot(),
		NgbModule,
		Ng2FlatpickrModule,
		PerfectScrollbarModule,
		AssignmentsViewModule
	],
	providers: []
})
export class TranslateModule {}
