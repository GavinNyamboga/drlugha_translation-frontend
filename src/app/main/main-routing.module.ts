import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../@core/guards/admin.guard';
import { AuthGuard } from '../../@core/guards/auth.guard';
import { MainComponent } from './main.component';
import { Role } from '../auth/models';
import { ReportsGuard } from '../../@core/guards/reports.guard';
import { ReReviewBatchesComponent } from './reports/re-review-batches/re-review-batches.component'; // Import ReReviewBatchesComponent

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        data: { roles: [Role.Admin] },
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'text-translate',
        loadChildren: () => import('./text-translate/text-translate.module').then((m) => m.TextTranslateModule)
      },
      {
        path: 'oral-translate',
        loadChildren: () => import('./oral-translate/oral-translate.module').then((m) => m.OralTranslateModule)
      },
      {
        path: 'oral-moderate',
        loadChildren: () => import('./oral-translate/oral-translate.module').then((m) => m.OralTranslateModule)
      },
      {
        path: 'sentences',
        data: { roles: [Role.Admin, Role.Viewer] },
        loadChildren: () => import('./language-sentences/language-sentences.module').then((m) => m.LanguageSentencesModule)
      },
      {
        path: 'users',
        data: { roles: [Role.Admin] },
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'reports',
        data: { roles: [Role.Admin, Role.Viewer] },
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
        canActivate: [ReportsGuard]
      },
      {
        path: 'rereview', // Add this route to match the menu URL
        data: { roles: [Role.Admin] },
        component: ReReviewBatchesComponent,
        // canActivate: [ReportsGuard] // Add any guards if needed
      },
      {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
