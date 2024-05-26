import { Component, OnInit } from '@angular/core';

import { EventService } from '../core/services/event.service';
import {
  LAYOUT_VERTICAL, LAYOUT_HORIZONTAL, LAYOUT_TWOCOLUMN, LAYOUT_MODE, LAYOUT_WIDTH,
  LAYOUT_POSITION, SIDEBAR_SIZE, SIDEBAR_COLOR, TOPBAR
} from './layout.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: []
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {

  layoutType!: string;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.layoutType = LAYOUT_VERTICAL;
  }

  /**
  * Check if the vertical layout is requested
  */

}
