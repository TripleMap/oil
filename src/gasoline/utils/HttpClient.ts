import { Observable } from 'rxjs';


export const baseHttp = {
    // TO DO использовать свои методы запросов
    // пока переобпределяем метод
    get(url: string, requestParams?: any): Observable<any> {
        return new Observable((observer) => {
            observer.next(true);
            observer.complete();
        })
    }
}