import * as L from 'leaflet';

import { geoJSONLayer, GeoJSONLayerProperties } from '../layers/Gosoline.GeoJSONLayer';

export const LayerTypes = ['GeoJSONLayer'];
export interface BaseLayerOpts {
    layerId: string;
    labelName: string;
    layerOptions: {
        type: string;
        url: string;
        options: {
            maxZoom: number,
            attribution: string;
        }
    }
}
export class BaseLayerManager {
    private map: any = null;
    public baseLayers: BaseLayerOpts[] = [];
    public overLayers: any = [];

    constructor(map, baseLayers: any[]) {
        this.map = map;
        this.baseLayers = baseLayers;
    }

    addBaseLayerToMap(layerId) {
        const layerOpts = this.baseLayers.filter(layer => layer.layerId === layerId).pop();
        if (layerOpts.layerOptions.type === 'tileLayer') {
            const leafletLayer = L.tileLayer(layerOpts.layerOptions.url, layerOpts.layerOptions.options);
            leafletLayer.addTo(this.map);
        }

    }


    addOverlayLayerToMap(layerOptions: GeoJSONLayerProperties, layerType) {
        if (~LayerTypes.indexOf(layerType) && layerType === 'GeoJSONLayer') {
            let geoJSONLayerBlanс = new geoJSONLayer(layerOptions)
                .addToMap(this.map);
            this.overLayers[layerOptions.id] = geoJSONLayerBlanс;
        }
    }

    toggleOverlayLayerVisibilityByLayerId(layerId, visibility) {
        const toogleAbleLayer = this.overLayers.filter(layer => layer.options.layerId === layerId).pop();
        toogleAbleLayer.toggleVisibility(visibility);
    }

}