import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {AssignmentsViewComponent} from "./assignments-view.component";
import {CoreSidebarModule} from "../core-sidebar/core-sidebar.module";
import {SidebarContentComponent} from "./components/sidebar-content/sidebar-content.component";
import {CoreCommonModule} from "../../common.module";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {AssignmentsSidebarComponent} from "./components/assignments-sidebar/assignments-sidebar.component";
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterLinkWithHref, RouterModule} from "@angular/router";
import { SidebarLinkComponent } from './components/sidebar-link/sidebar-link.component';



@NgModule({
	declarations: [
		AssignmentsViewComponent,
		SidebarContentComponent,
		AssignmentsSidebarComponent,
  SidebarLinkComponent
	],
	exports: [
		AssignmentsViewComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		CoreSidebarModule,
		CoreCommonModule,
		PerfectScrollbarModule,
		NgbAccordionModule,
		RouterLinkWithHref
	]
})
export class AssignmentsViewModule { }
