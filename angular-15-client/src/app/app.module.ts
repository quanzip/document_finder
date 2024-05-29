import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import {FileUploadService} from "./services/file-upload.service";
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import { SiteListComponent } from './components/site-list/site-list.component';
import { SiteDetailComponent } from './components/site-detail/site-detail.component';
import {SiteService} from "./services/site.service";
import { AddSiteComponent } from './components/add-site/add-site.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTutorialComponent,
    TutorialDetailsComponent,
    TutorialsListComponent,
    FileUploadComponent,
    SiteListComponent,
    SiteDetailComponent,
    AddSiteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [FileUploadService, SiteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
