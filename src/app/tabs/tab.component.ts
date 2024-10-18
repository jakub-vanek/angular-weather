import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {
  @Input() caption: string;
  @Input() selected: boolean;
  @Output('tabClosed') close = new EventEmitter<void>();
}
