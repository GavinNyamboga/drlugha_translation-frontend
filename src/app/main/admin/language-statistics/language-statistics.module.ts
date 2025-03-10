import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { LanguageStatisticsComponent } from "./language-statistics.component";

const routes: Routes = [
    {
        path: "",
        component: LanguageStatisticsComponent
    }
];

@NgModule({
    declarations: [
        LanguageStatisticsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class LanguaguageStatisticsModule {

}