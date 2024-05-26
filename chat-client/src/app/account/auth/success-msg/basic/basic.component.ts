import { Component } from '@angular/core';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: []
})

/**
 * Success Msg Basic Component
 */
export class BasicComponent {

  // set the current year
  year: number = new Date().getFullYear();

}
