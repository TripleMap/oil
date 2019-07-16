import { Injectable, NgZone } from '@angular/core';
import { BaseMapManager } from 'src/gasoline/mapManager/MapManager'
import { MapOptions } from 'leaflet';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  public mapManager: BaseMapManager = null;
  public mapOptions: MapOptions = {
    center: [60, 30],
    zoom: 15
  };

  public mapIsActive: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private ngZone: NgZone) {

  }

  createMap(mapContainerId: string) {
    this.mapManager = new BaseMapManager(mapContainerId, this.mapOptions, true);
    this.ngZone.runOutsideAngular(() => {
      this.mapManager.createLeafletMap();
    });
    this.mapIsActive.next(true);
  }

  getMap = () => this.mapManager.getMap();
}
