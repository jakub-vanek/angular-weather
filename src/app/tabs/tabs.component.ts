import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

    @Input() selectedTab: number;
    @Output() selectedTabChange = new EventEmitter<number>()

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    closeTab(tab: TabComponent, i: number): void {
        if (tab.selected) {
            this.selectTab((i - 1 > 0) ? i - 1 : 0);
        }
        tab.close.emit();
    }

    selectTab(i: number): void {
        console.log('SELECT TAB', i);
        this.selectedTabChange.emit(i);
    }
}
