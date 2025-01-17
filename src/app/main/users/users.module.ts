import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersComponent } from "./users.component";
import {RouterModule, Routes} from "@angular/router";
import { UserStatsComponent } from "./user-stats/user-stats.component";
import { CreateNewUserComponent } from "./create-new-user/create-new-user.component";
import {ReactiveFormsModule} from "@angular/forms";
import { ViewUserComponent } from "./view-user/view-user.component";
import {NgbNavModule, NgbProgressbarModule} from "@ng-bootstrap/ng-bootstrap";
import { SentenceStatisticsComponent } from "./components/sentence-statistics/sentence-statistics.component";
import { SentenceAssignmentsComponent } from "./components/sentence-assignments/sentence-assignments.component";
import { AudioAssignmentsComponent } from "./components/audio-assignments/audio-assignments.component";
import { AudioStatisticsComponent } from "./components/audio-statistics/audio-statistics.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { UserFormComponent } from "./components/user-form/user-form.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {CoreDirectivesModule} from "../../../@core/directives/directives";
import {AdminGuard} from "../../../@core/guards/admin.guard";

const routes: Routes = [
	{
		path: "",
		component: UsersComponent,
		children: [
			{
				path: "reports",
				component: UserStatsComponent,
				canActivate: [AdminGuard]
			},
			{
				path: "create",
				component: CreateNewUserComponent,
				canActivate: [AdminGuard]
			},
			{
				path: "view/:userId",
				component: ViewUserComponent
			},
			{
				path: "edit/:userId",
				component: EditUserComponent
			},
			{
				path: "",
				redirectTo: "reports",
				pathMatch: "full"
			}
		]
	}
];


@NgModule({
	declarations: [
		UsersComponent,
		UserStatsComponent,
		CreateNewUserComponent,
		ViewUserComponent,
		SentenceStatisticsComponent,
		SentenceAssignmentsComponent,
		AudioAssignmentsComponent,
		AudioStatisticsComponent,
		EditUserComponent,
		UserFormComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		CoreDirectivesModule,
		NgbProgressbarModule,
		NgbNavModule,
		NgSelectModule
	]
})
export class UsersModule { }
