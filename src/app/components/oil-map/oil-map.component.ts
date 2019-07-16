import { Component, AfterViewInit } from '@angular/core';
import { MapService } from 'src/app/services/map-service.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'oil-map',
  templateUrl: './oil-map.component.html',
  styleUrls: ['./oil-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OilMapComponent implements AfterViewInit {
  public mapContainerId: string = 'map';

  constructor(public mapService: MapService) { }

  ngAfterViewInit() {
    console.log('тут');
    this.mapService.createMap(this.mapContainerId);
  }
}
