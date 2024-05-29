import { Component } from '@angular/core';
import {Site} from "../../models/site.model";
import {SiteService} from "../../services/site.service";
import {FileUploadService} from "../../services/file-upload.service";

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.css']
})
export class AddSiteComponent {

  site: Site = {
    name: '',
    code: '',
  };
  submitted = false;

  constructor(
    private siteService: SiteService,
  ) { }

  saveSite(): void {
    const data = {
      name: this.site.name,
      code: this.site.code
    };

    this.siteService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  newSite(): void {
    this.submitted = false;
    this.site = {
      name: '',
      code: '',
    };
  }
}
