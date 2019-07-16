import { GeoJSON } from 'geojson';
import * as L from 'leaflet';

import { BehaviorSubject } from "rxjs";
import 'rxjs/add/operator/map';
import { GeoJSONProvider } from "./Gesoline.GeoJSONProvider";
import { GeojsonValidationError } from '../utils/Exceptions';

export interface GeoJSONLayerProperties extends L.GeoJSONOptions {
    id: string;
    labelName: string;
    className: string;
    onceLoaded: boolean;
    dataUrl: string;
    selectionStyle?: any;
    visible: boolean;
}


export const GeoJSONLayer = L.GeoJSON.extend({
    layerType: 'GeoJSONLayer',
    activeStyle: {
        weight: 4,
        color: "#ff6d00"
    },

    selectedFeature: new BehaviorSubject(null),

    closeOnEscape: function (e) {
        if (e.key === "Escape") this.clearSelections();
    },

    initialize: function (options: GeoJSONLayerProperties) {
        options.className = `layer_${this.options.id}`;

        // не понятно почему в типах этого нет
        (L as any).setOptions(this, options);
        (L as any).GeoJSON.prototype.initialize.call(this, null, options);
        this._provider = new GeoJSONProvider(this.options.dataUrl, this.options.onceLoaded);

        this.activeStyle = this.options.selectionStyle ? this.options.selectionStyle : this.activeStyle;
    },

    onAdd: function (map) {
        this._map = map;
        L.GeoJSON.prototype.onAdd.call(this, map);
        this.updateData();
        if (!this.options.onceLoaded) this._map.on("moveend", this.updateData, this);

        const handler = this.closeOnEscape.bind(this);
        document.addEventListener('keydown', handler, true);
    },

    onRemove: function (map) {
        this.clearLayers();
        L.GeoJSON.prototype.onRemove.call(this, map);
        if (!this.options.onceLoaded) map.off("moveend", this.updateData, this);

        const handler = this.closeOnEscape.bind(this);
        document.removeEventListener('keydown', handler, true);
    },


    clearLayers() {
        this.eachLayer(layer => this.removeLayer(layer))
    },


    updateData: function (e: any) {
        if (!this._map) return;
        const bbox = !this.options.onceLoaded ? this._map.getBounds() : null;

        const zoom = this._map.getZoom();
        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            this.clearLayers();
            return;
        }
        if (!this.options.visible) return;
        this.updateDataByBounds(bbox);
    },

    updateDataByBounds: function (bbox) {
        this._provider
            .getDataByBounds(bbox)
            .subscribe(
                data => {
                    this._replaceData(data);
                    this.fire("layer:load:success");
                    this._map.fire("layer:load:success");
                },
                error => {
                    this.clearLayers();
                    this.fire("layer:load:fail");
                    this._map.fire("layer:load:fail");
                    throw new GeojsonValidationError({
                        message: 'Ошибка загрузки данных',
                        error
                    });
                }
            );
    },


    _replaceData: function (data) {
        this.clearLayers();
        const features = data.features ? data.features : data;
        let len = features.length - 1;
        for (let i = len; i >= 0; i--) {
            this.addData(features[i]);
        }

        this.subscribeOnSelection();
    },

    subscribeOnSelection: function () {
        this.off('click', this.addSelections, this);
        this.off('dblclick', this.clearSelections, this);

        this.eachLayer(layer => {
            if ((this.selectedFeatures as BehaviorSubject<string>).value === layer.feature.properties.id) this.setSelectionStyle(layer);
        });

        this.on('click', this.addSelections, this);
        this._map.doubleClickZoom.disable();
        this.on('dblclick', this.clearSelections, this);

    },

    addSelections: function (event) {
        const featureId = (event.layer.feature && event.layer.feature.properties && event.layer.feature.properties.id) ? event.layer.feature.properties.id : null;
        this.setSelectionStyle(event.layer);
        this.selectedFeature.next(featureId);
    },

    clearSelections: function (event?) {
        this.eachLayer(layer => this.removeSelectionLayer(layer));
        this.selectedFeatures.clear();
    },


    setSelectionStyle(layer) {
        if (!layer) return;
        layer.beforeSelectionStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };
        layer.setStyle(this.activeStyle);
    },

    removeSelectionLayer(layer) {
        if (layer.beforeSelectionStyle) layer.setStyle(layer.beforeSelectionStyle);
    },

    toggleVisibility(visible?) {
        this.options.visible = visible ? visible : !!this.options.visible;
        this.updateData();
    }
});



export const geoJSONLayer = function (options): void {

    // ??? почему тип не правильно истолковывается
    // воспринимает как contructor, а не initialize
    return (new GeoJSONLayer as any)(options);
};





