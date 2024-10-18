import {Component, ContentChildren, QueryList} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    closeTab(tab: TabComponent, i: number): void {
        if (tab.selected) {
            this.selectTab((i - 1 > 0) ? i - 1 : 0);
        }
        tab.close.emit();
    }

    selectTab(i: number): void {
        this.tabs.map(x => x.selected = false);
        this.tabs.get(i).selected = true;
    }
}
