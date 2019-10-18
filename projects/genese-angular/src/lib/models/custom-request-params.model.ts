import { RequestMethod } from '../enums/request-method';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions } from './request-options.model';

export class CustomRequestParams {
    body?: object = {};
    id?: string;
    method?: RequestMethod = RequestMethod.GET;
    options?: RequestOptions;
    path?: string;
    url?: string;
}
