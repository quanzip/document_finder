import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layouts/layout.component";



/*import { AuthGuard } from './core/guards/auth.guard';*/

const routes: Routes = [ // need edit
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},  // , canActivate: [AuthGuard]   Em tạm comment đi để thông luồng chat trc, vc này em sẽ làm ở cuối sprint ạ
  // { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
