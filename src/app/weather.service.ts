import {Inject, Injectable, Signal} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {LocationService} from './location.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {toSignal} from '@angular/core/rxjs-interop';
import {CacheService} from './cache.service';

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions: Signal<ConditionsAndZip[]>;

  constructor(
      private http: HttpClient,
      private locationService: LocationService,
      @Inject('CurrentConditionsCache') private currentConditionsCache: CacheService<CurrentConditions>,
      @Inject('ForecastCache') private forecastCache: CacheService<Forecast>) {

      const currentConditions$: Observable<ConditionsAndZip[]> =
          this.locationService.getLocations().pipe(
              switchMap(locations => this.fetchConditionsAndZips(locations))
          );
      this.currentConditions = toSignal(currentConditions$, { initialValue: [] });
  }

  private fetchConditionsAndZips(locations : string[]): Observable<ConditionsAndZip[]> {
    if (locations.length > 0) {
      return forkJoin(locations.map(zipcode =>
          this.fetchCurrentConditions(zipcode).pipe(map(cc => ({zip: zipcode, data: cc})))
      ));
    } else {
      return of([]);
    }
  }

  private fetchCurrentConditions(zipcode : string): Observable<CurrentConditions> {
    const url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
    const cached = this.currentConditionsCache.get(url);

    if (cached) {
      return of(cached);
    } else {
      return this.http.get<CurrentConditions>(url).pipe(
          tap(x => this.currentConditionsCache.set(url, x))
      );
    }
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions;
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    const cached = this.forecastCache.get(url);

    if (cached) {
      return of(cached);
    } else {
      return this.http.get<Forecast>(url).pipe(
          tap(x => this.forecastCache.set(url, x))
      );
    }
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }
}
