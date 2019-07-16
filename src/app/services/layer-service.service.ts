import { Injectable } from '@angular/core';
import { MapService } from './map-service.service';
import { BaseLayerManager, BaseLayerOpts } from 'src/gasoline/mapManager/LayerManager'



@Injectable({
  providedIn: 'root'
})
export class LayerService {
  public layerManager: BaseLayerManager;

  public baseLayers: BaseLayerOpts[] = [{
    layerId: 'osm',
    labelName: "Open Street Map",
    layerOptions: {
      type: 'tileLayer',
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 24,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    }
  }]

  constructor(public mapService: MapService) {
    this.mapService.mapIsActive
      .filter(active => active)
      .subscribe(active => {
        this.layerManager = new BaseLayerManager(this.mapService.getMap(), this.baseLayers);
        this.addBaseMap(this.baseLayers[0].layerId)
      })
  }

  addBaseMap(layerId) {
    this.layerManager.addBaseLayerToMap(layerId);
  }
}
