import * as L from 'leaflet';
import { GeoJSON } from 'geojson';
import * as geojsonhint from '@mapbox/geojsonhint';
import { GeojsonValidationError } from '../utils/Exceptions';
import { baseHttp } from '../utils/HttpClient';
import { Observable } from 'rxjs';


export class GeoJSONProvider {
    public dataUrl: string;
    public geoJSON: any = null;
    private onceLoading: boolean = false;
    constructor(dataUrl?: string, onceLoaded: boolean = null) {
        if (!dataUrl) throw new Error("Не задан url");
        this.dataUrl = dataUrl;
        this.onceLoading = onceLoaded;
    }

    fetchData = (bounds?: string): Observable<any> => baseHttp.get(this.dataUrl, bounds);

    getDataByBounds(bounds?: string): Observable<GeoJSON> {
        return new Observable((observer) => {
            // если есть границы, запрашиваем данные по границам
            if (this.onceLoading && this.geoJSON) {
                observer.next(this.geoJSON);
                observer.complete();
                return;
            }

            this.fetchData(bounds)
                .subscribe(
                    data => {
                        if (data) {
                            const errors = geojsonhint.hint(data);
                            const onlyMessagesError = errors.filter(error => (error.level === "message") ? error : false).length === errors.length;
                            if ((errors && !errors.length) || (errors && errors.length && onlyMessagesError)) {
                                this.geoJSON = data;
                                if (!bounds) observer.next(data);
                                observer.complete();
                            } else {
                                observer.error(new GeojsonValidationError({
                                    message: 'Не валидная геометрия',
                                    errors
                                }));
                                observer.complete();
                            }
                        }
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                )
        })
    }
}


