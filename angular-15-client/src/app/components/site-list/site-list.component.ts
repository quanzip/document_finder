import { Component, OnInit } from '@angular/core';
import { Site } from 'src/app/models/site.model';
import {SiteService} from "../../services/site.service";

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {
  sites?: Site[];
  currentSite: Site = {};
  currentIndex = -1;
  siteName = '';

  constructor(private siteService: SiteService) { }

  ngOnInit(): void {
    this.retrieveSites();
  }

  retrieveSites(): void {
    this.siteService.getAll()
      .subscribe({
        next: (data) => {
          this.sites = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveSites();
    this.currentSite = {};
    this.currentIndex = -1;
  }

  setActiveSite(site: Site, index: number): void {
    this.currentSite = site;
    this.currentIndex = index;
  }

  removeAllSites(): void {
    this.siteService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  searchName(): void {
    this.currentSite = {};
    this.currentIndex = -1;

    this.siteService.findByName(this.siteName)
      .subscribe({
        next: (data) => {
          this.sites = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

}
