import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  locations : string[] = [];
  locationsSubject : BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    this.locationsSubject.next(this.locations);
  }

  getLocations() : Observable<string[]> {
    return this.locationsSubject.asObservable();
  }

  addLocation(zipcode : string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.locationsSubject.next(this.locations);
  }

  removeLocation(zipcode : string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locationsSubject.next(this.locations);
    }
  }
}
