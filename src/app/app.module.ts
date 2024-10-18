import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import {LocationService} from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {CacheService} from './cache.service';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {Forecast} from './forecasts-list/forecast.type';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tabs/tab.component';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    TabsComponent,
    TabComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
      LocationService,
      WeatherService,
      { provide: 'CurrentConditionsCache', useFactory: () => (new CacheService<CurrentConditions>(60*1000)) },
      { provide: 'ForecastCache', useFactory: () => (new CacheService<Forecast>(60*1000)) },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
