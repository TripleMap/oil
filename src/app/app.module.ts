import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import 'rxjs/add/operator/filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { LayerService } from './services/layer-service.service';
import { MapService } from './services/map-service.service';


import { OilMapComponent } from './components/oil-map/oil-map.component';
import { LayerManagerComponent } from './components/layer-manager/layer-manager.component';
import { FeatureInfoComponent } from './components/feature-info/feature-info.component';




@NgModule({
  declarations: [
    AppComponent,
    OilMapComponent,
    LayerManagerComponent,
    FeatureInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    LayerService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
