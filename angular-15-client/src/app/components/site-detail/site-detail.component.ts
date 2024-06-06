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
  showScript = false;
  copy = false;

  domain='http://videocalltest.viettel.vn/document-finder'

  @Input() currentSite: Site = {
    name: '',
    address: '',
    code: '',
    // title: '',
    // description: '',
    // published: false
  };


  SelectAll(id: any)
  {
    document.getElementById(id)!!.focus();
    (document.getElementById(id) as HTMLInputElement).select();
  }

  copyText(e: any) {
    let script = e.target.parentNode.nextSibling.value;
    let globalThis = this;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(script).then(function () {
        // globalThis.toastSvc.showSuccess(globalThis.translate.instant("DOMAINS.SCRIPT_COPIED"));
        globalThis.copy = true
      }, function (err) {
        // globalThis.toastSvc.showDanger(globalThis.translate.instant("DOMAINS.SCRIPT_COPY_FAILED"));
        globalThis.copy = true
      });
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = script;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        // globalThis.toastSvc.showSuccess(globalThis.translate.instant("DOMAINS.SCRIPT_COPIED"));
        globalThis.copy = true
      } catch (error) {
        // globalThis.toastSvc.showDanger(globalThis.translate.instant("DOMAINS.SCRIPT_COPY_FAILED"));
        globalThis.copy = true
      } finally {
        textArea.remove();
      }
    }
  }

  message = '';
  openDialog = false
  popupContent = ''

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
