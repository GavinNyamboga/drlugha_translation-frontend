import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BatchDetailsComponent } from "./batch-details/batch-details.component";
import { RouterModule, Routes } from "@angular/router";
import { AllBatchesComponent } from "./all-batches/all-batches.component";
import { BatchComponent } from "./batch.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AssignVerifiersComponent } from "./components/assign-verifiers/assign-verifiers.component";
import { AssignTranslatorComponent } from "./components/assign-translator/assign-translator.component";
import { AdminModule } from "../admin.module";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSliderModule } from "@angular/material/slider";
import { MatTabsModule } from "@angular/material/tabs";
import { CoreCommonModule } from "../../../../@core/common.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

const routes: Routes = [
	{
		path: "",
		component: BatchComponent,
		children: [
			{
				path: "view",
				component: AllBatchesComponent
			},
			{
				path: "view/:batchId",
				component: BatchDetailsComponent
			},
			{
				path: "",
				redirectTo: "all",
				pathMatch: "full"
			}
		]
	}
];

@NgModule({
	declarations: [
		BatchDetailsComponent,
		AllBatchesComponent,
		BatchComponent,
		AssignVerifiersComponent,
		AssignTranslatorComponent
	],
	exports: [
		BatchComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatStepperModule,
		MatSliderModule,
		ReactiveFormsModule,
		MatTabsModule,
		AdminModule,
		CoreCommonModule,
		NgbModule,
		NgSelectModule,
	]
})
export class BatchModule { }
