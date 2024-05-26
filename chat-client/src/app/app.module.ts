import {APP_INITIALIZER, isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// search module
import {Ng2SearchPipeModule} from 'ng2-search-filter';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {LayoutsModule} from "./layouts/layouts.module";
import {PagesModule} from "./pages/pages.module";

// Auth
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {initFirebaseBackend} from './authUtils';
import {FakeBackendInterceptor} from './core/helpers/fake-backend';
import {ErrorInterceptor} from './core/helpers/error.interceptor';
import {JwtInterceptor} from './core/helpers/jwt.interceptor';

// Language
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {OAuthModule, OAuthStorage} from "angular-oauth2-oidc";
import {StompService} from "./shared/services/stomp.service";
import {NgxSimplebarModule} from "ngx-simplebar";
import {ConfigService} from "./shared/services/config.service";
import {BasicAuthInterceptor} from "./core/helpers/basic-auth.interceptor";
import {DomainDataService} from "./core/services/domain-data.service";

export function init_app(domainService: ConfigService) {
    return () => domainService.load();
}

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} //else {
  // FakeBackendInterceptor;
// }

export function datatableAjax(url: string, accessToken: string, form?: any): any {
  return {
    url: url,
    type: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: (data: any) => {
      for (let i = 0; i < data.columns.length; i++) {
        let column = data.columns[i];
        column.searchRegex = column.search.regex;
        column.searchValue = column.search.value;
        delete (column.search);
      }
      if (form) {
        for (let key in form) {
          if (data.hasOwnProperty(key)) {
            console.warn("[datatableAjax] using form value for key: " + key);
          }
          data[key] = form[key];
        }
      }
    },
    dataFilter: (data: any) => {
      let json = JSON.parse(data);
      json.recordsTotal = json.total_elements;
      json.recordsFiltered = json.total_elements;
      return JSON.stringify(json); // return JSON string
    }
  };
}

 /*We need a factory since localStorage is not available at AOT build time*/
export function oAuthStorageFactory(): OAuthStorage {
  return localStorage; //sessionStorage
}

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        TranslateModule.forRoot({
            defaultLanguage: 'vn',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        LayoutsModule,
        PagesModule,
        Ng2SearchPipeModule,

        //HttpClientModule, angular-oauth2-oidc
        OAuthModule.forRoot(),
        NgxSimplebarModule

    ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [ConfigService], multi: true },
    {provide: OAuthStorage, useFactory: oAuthStorageFactory},
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},  //  Em tạm comment đi để thông luồng chat trc, vc này em sẽ làm ở cuối sprint ạ
    // {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true},
    StompService,
    ConfigService,
      DomainDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
