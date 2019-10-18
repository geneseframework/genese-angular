import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { GetAllParams, GetAllResponse } from '../models/get-all.params.model';
import { TConstructor } from '../models/t-constructor.model';
import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';
import { Language } from '../enums/language';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { ResponseStatus } from '../enums/response-status';
import { CustomRequestParams } from '../models/custom-request-params.model';
import { RequestMethod } from '../enums/request-method';
import { RequestOptions } from '../models/request-options.model';

export class Genese<T> {

    // --------------------------------------------------
    //                     PROPERTIES
    // --------------------------------------------------


    private geneseMapperService: GeneseMapperFactory<T>;

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------


    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService,
                private tConstructor: TConstructor<T>) {
        this.geneseMapperService = new GeneseMapperFactory<T>(tConstructor);
    }


    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------


    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOne(id?: string, path?: string): Observable<T> {
        if (!id && !path) {
            console.error('No id or incorrect path : impossible to get element');
            return of(undefined);
        }
        // const url = id ? this.apiRoot(path) + '/' + id : this.apiRoot(path);
        return this.http.get(this.apiRoot(path, id), {})
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<T>(data);
                })
            );
    }

    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    customRequest(params: CustomRequestParams): Observable<T> {
        if (!params || !params.path) {
            console.error('Incorrect parameters : impossible to get element');
            return of(undefined);
        }
        // console.log('%c getOneCustom params', 'font-weight: bold; color: green;', params);
        const method = Tools.default(params.method, RequestMethod.GET);
        let request;
        switch (method) {
            case RequestMethod.DELETE:
                request = this.http.delete(this.apiRoot(params.path), {observe: 'response'});
                break;
            case RequestMethod.POST:
                request = this.http.post(this.apiRoot(params.path), params.body, params.options);
                break;
            case RequestMethod.PUT:
                request = this.http.put(this.apiRoot(params.path), params.body, params.options);
                break;
            case RequestMethod.GET:
            default:
                request = this.http.get(this.apiRoot(params.path), params.options);
        }
        return request.pipe(
            map((data: any) => {
                if (method === RequestMethod.DELETE) {
                    return this.geneseMapperService.mapToObject<T>(data ? data.body : undefined);

                } else {
                    return this.geneseMapperService.mapToObject<T>(data);
                }
            })
        );
    }

    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOneExtract<U>(id: string, uConstructor: TConstructor<U>, path?: string): Observable<U> {
        if (!id || !uConstructor) {
            console.error('No id or no uConstructor : impossible to get element');
            return of(undefined);
        }
        let httpParams = new HttpParams();
        httpParams = httpParams.set('gnExtract', JSON.stringify(new uConstructor()));
        const options = {params: httpParams};
        return this.http.get(this.apiRoot(path, id), options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<U>(data, uConstructor) as U;
                })
            );
    }

    /**
     * Get all elements
     * If the http response format have this format :
     * {
     *      totalResults?: number;
     *      totalpages?: number;
     *      results: any;
     * }
     *
     * If not, it returns T[] object
     */
    getAll<U = T>(params?: GetAllParams): Observable<GetAllResponse<U> | U[]> {
        params = Tools.default(params, {});
        let httpParams = new HttpParams();
        httpParams = params.page !== undefined ? httpParams.set('gnpage', params.page.toString()) : httpParams;
        httpParams = params.limit ? httpParams.set('gnlimit', params.limit.toString()) : httpParams;
        httpParams = params.extract ? httpParams.set('gnextract', JSON.stringify(params.extract)) : httpParams;
        if (params.filters) {
            for (const key of Object.keys(params.filters)) {
                if (params.filters[key]) {
                    httpParams = httpParams.set(key, params.filters[key].toString());
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(params.path);
        // const url = params && params.path ? this.geneseEnvironment.api + params.path : this.apiRoot();
        return this.http.get(url, options).pipe(
            map((response: any) => {
                if (response) {
                    if (this._responseWithPagination(response)) {
                        return {
                            results: this.geneseMapperService.mapGetAllResults<U>(response.results),
                            totalResults: response.totalResults};
                    } else {
                        return this.geneseMapperService.mapGetAllResults<U>(response);
                    }
                } else {
                    return [];
                }
            })
        );
    }

    /**
     * Create an element with param body or with this.mappedObject() when there is no param
     *
     * Example of implementation :
     *
     * this.partService
     *      .mapToCreate(this.part)
     *      .create()
     *
     * If you want to use custom apiDelete or custom body, use these optional params
     */
    create(body?: object, path?: string, options?: RequestOptions): Observable<T> {
        body = Tools.default(body, {});
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        const url = this.apiRoot(path);
        return this.http.post(url, body, options)
            .pipe(
                map((result) => {
                    return this.geneseMapperService.mapToObject(result);
                })
            );
    }

    /**
     * Update an element
     */
    update(id?: string,  path?: string, body?: object, options?: RequestOptions): Observable<T> {
        if (!id && !path) {
            console.error('Error updating element: undefined id or incorrect path');
            return of(undefined);
        }
        body = Tools.default(body, {});
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        const url = this.apiRoot(path, id);
        return this.http.put( url, body, options)
            .pipe(
                map(result => {
                    return this.geneseMapperService.mapToObject(result);
                })
            );
    }


    /**
     * Delete an element
     */
    delete(id?: string, path?: string, options?: RequestOptions): Observable<ResponseStatus> {
        if (!id && !path) {
            console.error('No id or incorrect path : impossible to delete element');
            return of(undefined);
        }
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        options.observe = Tools.default(options.observe, 'response');
        const url = this.apiRoot(path, id);
        return this.http.delete(url, options)
            .pipe(
                map((response: HttpResponse<any>) => {
                    return response && response.ok === true ? ResponseStatus.SUCCESS : ResponseStatus.FAILED;
                })
            );
    }

    /**
     * Get the root path of the api
     */
    apiRoot(path?: string, id?: string): string {
        const url = path
            ? this.geneseEnvironment.api + path
            : this.geneseEnvironment.api + '/' + Tools.classNameToUrl(this.tConstructor.name);
        return id ? `${url}/${id}` : url;
    }



    private _responseWithPagination(data: any): boolean {
        return data && Array.isArray(data.results);
    }


    /**
     * Translate data for a given language
     */
    translate<U = T>(data: U, language: Language): U {
        if (!language) {
            console.error('No data or no language : impossible to get element');
            return undefined;
        } else {
            return this.geneseMapperService.translate<U>(data, language);
        }
    }

}
