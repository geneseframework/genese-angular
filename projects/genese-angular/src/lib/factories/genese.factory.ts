import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { GnRequest, GetAllResponse } from '../models/gn-request-params';
import { TConstructor } from '../models/t-constructor';
import { GeneseMapperFactory } from './genese-mapper.factory';
import { ToolsService } from '../services/tools.service';
import { Language } from '../enums/language';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { ResponseStatus } from '../enums/response-status';
import { GetOneParams } from '../models/get-one.model';
import { RequestMethod } from '../enums/request-method';

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
    getOne(id: string, path?: string): Observable<T> {
        if (!id) {
            console.error('No id : impossible to get element');
            return of(undefined);
        }
        console.log('%c getOne id', 'font-weight: bold; color: blue;', id);
        return this.http.get(this.apiRoot(path) + '/' + id, {})
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<T>(data);
                })
            );
    }

    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    customRequest(params: GetOneParams): Observable<T> {
        if (!params || !params.path) {
            console.error('Incorrect parameters : impossible to get element');
            return of(undefined);
        }
        console.log('%c getOneCustom params', 'font-weight: bold; color: green;', params);
        const method = ToolsService.default(params.method, RequestMethod.GET);
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
                console.log('%c getOneCustom data', 'fontweight: bold; color: green;', data);
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
        return this.http.get(this.apiRoot(path) + '/' + id, options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<U>(data, uConstructor) as U;
                })
            );
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

    /**
     * Get all elements
     * If the http response format have this format :
     * {
     *      totalResults?: number;
     *      totalPages?: number;
     *      results: any;
     * }
     *
     * If not, it returns T[] object
     */
    getAll<U = T>(params?: GnRequest): Observable<GetAllResponse<U> | U[]> {
        console.log('%c getAll params', 'font-weight: bold; color:blue ;', params);
        const getAllParams = params ? params : {};
        let httpParams = new HttpParams();
        httpParams = getAllParams.gnPage !== undefined ? httpParams.set('gnPage', getAllParams.gnPage.toString()) : httpParams;
        httpParams = getAllParams.gnLimit ? httpParams.set('gnLimit', getAllParams.gnLimit.toString()) : httpParams;
        httpParams = getAllParams.gnExtract ? httpParams.set('gnExtract', JSON.stringify(getAllParams.gnExtract)) : httpParams;
        if (getAllParams.gnFilters) {
            for (const key of Object.keys(getAllParams.gnFilters)) {
                if (getAllParams.gnFilters[key]) {
                    httpParams = httpParams.set(key, getAllParams.gnFilters[key].toString());
                }
            }
        }
        const options = {params: httpParams};
        const url = params && params.gnPath ? this.geneseEnvironment.api + params.gnPath : this.apiRoot();
        console.log('%c getAll this.geneseEnvironment.api', 'font-weight: bold; color:blue ;', this.geneseEnvironment.api);
        console.log('%c getAll this.geneseEnvironment', 'font-weight: bold; color:blue ;', this.geneseEnvironment);
        console.log('%c getAll url', 'font-weight: bold; color:blue ;', url);
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
     * Delete an element
     */
    delete(id?: string, apiDelete?: string): Observable<ResponseStatus> {
        if (!id && !apiDelete) {
            console.error('%c Error deleting element: undefined id and url ');
            return of(undefined);
        } else {
            return this.http.delete(this.apiRoot() + '/' + id, {observe: 'response'})
                .pipe(
                    map((response: HttpResponse<any>) => {
                        return response && response.ok === true ? ResponseStatus.SUCCESS : ResponseStatus.FAILED;
                    })
                );
        }
    }

    /**
     * Get the root path of the api
     */
    apiRoot(path?: string): string {
        return path
            ? this.geneseEnvironment.api + path
            : this.geneseEnvironment.api + '/' + ToolsService.classNameToUrl(this.tConstructor.name);
    }



    private _responseWithPagination(data: any): boolean {
        return data && Array.isArray(data.results);
    }

    private _httpMethod(method: RequestMethod): any {
        return this.http.get;
        // return this.http[method];
    }
    // private _httpMethod(method: RequestMethod): (url: string,
    //                                              options?: {
    //                                                  headers?: HttpHeaders | {
    //                                                      [header: string]: string | string[];
    //                                                  };
    //                                                  observe?: 'body';
    //                                                  params?: HttpParams | {
    //                                                      [param: string]: string | string[];
    //                                                  };
    //                                                  reportProgress?: boolean;
    //                                                  responseType?: 'json';
    //                                                  withCredentials?: boolean;
    //                                              }) => Observable<T> {
    //     return this.http[method];
    // }
}
