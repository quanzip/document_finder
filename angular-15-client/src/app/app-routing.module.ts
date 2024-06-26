import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import {SiteListComponent} from "./components/site-list/site-list.component";
import {SiteDetailComponent} from "./components/site-detail/site-detail.component";
import {AddSiteComponent} from "./components/add-site/add-site.component";

const routes: Routes = [
  { path: '', redirectTo: 'sites', pathMatch: 'full' },
  { path: 'sites', component: SiteListComponent },
  { path: 'sites/:id', component: SiteDetailComponent },
  { path: 'add-site', component: AddSiteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
