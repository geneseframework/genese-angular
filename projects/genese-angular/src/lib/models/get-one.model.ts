import { RequestMethod } from '../enums/request-method';
import { HttpHeaders, HttpParams } from '@angular/common/http';

export class GetOneParams {
    body?: object = {};
    id?: string;
    method?: RequestMethod = RequestMethod.GET;
    options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    };
    path?: string;
    url?: string;
}
