import {Component, Input, OnInit} from '@angular/core';
import {Site} from "../../models/site.model";
import {SiteService} from "../../services/site.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.css']
})
export class SiteDetailComponent implements OnInit {

  @Input() viewMode = false;

  @Input() currentSite: Site = {
    name: '',
    address: '',
    code: '',
    // title: '',
    // description: '',
    // published: false
  };

  genCode(){
    this.siteService.gencode(this.currentSite.code).subscribe(res => {

    })
  }

  message = '';

  constructor(
    private siteService: SiteService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getSite(this.route.snapshot.params["id"]);
    }
  }

  getSite(id: string): void {
    this.siteService.get(id)
      .subscribe({
        next: (data) => {
          this.currentSite = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  updateSite(): void {
    this.message = '';

    this.siteService.update(this.currentSite.id, this.currentSite)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This site was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteSite(): void {
    this.siteService.delete(this.currentSite.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/sites']);
        },
        error: (e) => console.error(e)
      });
  }


}
