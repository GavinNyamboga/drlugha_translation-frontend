import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RecordComponent } from "./record/record.component";
import { ProfileComponent } from "./profile/profile.component";

@NgModule({
	declarations: [
		RecordComponent,
		ProfileComponent,
	],
	imports: [
		CommonModule,
	],
	exports: [
		RecordComponent,
		ProfileComponent
	]
})
export class SharedModule { }
