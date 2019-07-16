import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OilMapComponent } from './components/oil-map/oil-map.component';


const routes: Routes = [
  { path: '', component: OilMapComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
