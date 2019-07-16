import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';

export class BaseMapManager {
    public memorize: boolean;
    public map: any;
    public mapContainerId: string = null;
    public mapOptions: any = null;
    public mapIsActive: BehaviorSubject<boolean> = new BehaviorSubject(false)

    constructor(mapContainerId: string, mapOptions: L.MapOptions, memorize: boolean) {
        this.memorize = memorize;
        this.mapContainerId = mapContainerId;
        this.mapOptions = mapOptions;
    }


    createLeafletMap = () => {
        this.map = L.map((this.mapContainerId || 'map'), this.mapOptions);
        if (this.memorize && this.memorize) this.restoreMapPosition();
        this.mapIsActive.next(true);
        return this;
    }


    restoreMapPosition() {
        let zoom: number, lat: number, lng: number;

        const zoomState = window.localStorage.getItem("MAP_STATE_ZOOM");
        const latState = window.localStorage.getItem("MAP_STATE_COORDINATES_LAT");
        const lngState = window.localStorage.getItem("MAP_STATE_COORDINATES_LNG");

        if (zoomState) zoom = Number(zoomState);

        if (latState && lngState) {
            lat = Number(latState);
            lng = Number(lngState);
        }

        if (zoom && lat && lng) this.map.setView([lat, lng], zoom);

        let saveMapState = () => {
            window.localStorage.setItem("MAP_STATE_ZOOM", this.map.getZoom());
            window.localStorage.setItem("MAP_STATE_COORDINATES_LAT", this.map.getCenter().lat);
            window.localStorage.setItem("MAP_STATE_COORDINATES_LNG", this.map.getCenter().lng);
        };

        window.addEventListener("beforeunload", saveMapState);
        return this;
    }

    updateMapPosition = (latLng, zoom) => {
        this.map.setView(latLng, zoom);
        return this;
    }

    getMap = () => this.map;
}