import { GetAllParams, GetAllResponse, GetAllWithPaginationParams } from '../models/get-all-params.model';
import { TConstructor } from '../models/t-constructor.model';
import { Tools } from '../services/tools.service';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { ResponseStatus } from '../enums/response-status';
import { RequestMethod } from '../enums/request-method';
import { RequestOptions } from '../models/request-options.model';
import { GetOneParams } from '../models/get-one-params.model';
import { GeneseMapper } from 'genese-mapper';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class Genese<T> {


    private geneseMapperService: GeneseMapper<T>;


    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService,
                private tConstructor: TConstructor<T>) {
        this.geneseMapperService = new GeneseMapper<T>(tConstructor);
    }


    // --------------------------------------------------
    //                   CRUD METHODS
    // --------------------------------------------------


    /**
     * Creates an object and return an Observable of the created object with T type
     * @deprecated since 1.2.0. Please use post() method instead
     */
    create(newObject: T, options?: RequestOptions): Observable<T | any> {
        this.checkTType(newObject);
        return this.http.post(this.apiRoot(this.getStandardPath()), newObject, this.getRequestOptions(options))
            .pipe(
                map((result) => {
                    if (options && options.mapData === false) {
                        return result;
                    } else {
                        return this.geneseMapperService.map(result);
                    }
                })
            );
    }



    /**
     * Creates an object and return an Observable of the created object with T type
     * @deprecated since 1.2.0. Please use post() method instead
     */
    createCustom(path: string, body?: object, options?: RequestOptions): Observable<T | any> {
        this.checkPath(path);
        body = Tools.default(body, {});
        return this.http.post(this.apiRoot(path), body, this.getRequestOptions(options))
            .pipe(
                map((result) => {
                    if (options && options.mapData === false) {
                        return result;
                    } else {
                        return this.geneseMapperService.map(result);
                    }
                })
            );
    }



    /**
     * Deletes an element and returns success or failed status.
     * This method needs to respect Genese standard model
     */
    delete(id: string): Observable<ResponseStatus> {
        this.checkId(id);
        return this.http.delete(`${this.apiRoot(this.getStandardPath())}/${id}`, {observe: 'response'})
            .pipe(
                map((response: HttpResponse<any>) => {
                    return response && response.ok === true ? ResponseStatus.SUCCESS : ResponseStatus.FAILED;
                })
            );
    }



    /**
     * Delete an element and returns success or failed status.
     * This method can be used with custom params.
     */
    deleteCustom(path: string, options?: RequestOptions): Observable<ResponseStatus> {
        this.checkPath(path);
        const url = this.apiRoot(path);
        options = Tools.default(options, {});
        Object.assign(options, {observe: 'response'});
        return this.http.delete(url, options as unknown)
            .pipe(
                map((response: HttpResponse<any>) => {
                    return response && response.ok === true ? ResponseStatus.SUCCESS : ResponseStatus.FAILED;
                })
            );
    }



    /**
     * Returns mapped object using fetch method
     */
    async fetch(path: string, method: RequestMethod, requestInit?: RequestInit): Promise<T> {
        if (!method || !path) {
            console.error('Incorrect parameters : impossible to send request');
            return Promise.reject('Incorrect parameters : impossible to send request');
        }
        const url = this.apiRoot(path);
        const response = await fetch(url, requestInit);
        const data = await response.clone().json();
        if (method === RequestMethod.DELETE) {
            return this.geneseMapperService.map(data ? data.body : undefined);
        } else {
            return this.geneseMapperService.map(data);
        }
    }



    /**
     * Get all elements of array of data returned by GET request and map them with T type
     */
    getAll(params?: GetAllParams): Observable<T[]> {
        let httpParams = new HttpParams();
        if (params && params.filters) {
            for (const key of Object.keys(params.filters)) {
                if (params.filters[key]) {
                    httpParams = httpParams.set(key, params.filters[key].toString());
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(this.getStandardPath());
        return this.http.get(url, options).pipe(
            map((response: any) => {
                return response ? this.geneseMapperService.arrayMap(response) : [];
            })
        );
    }



    /**
     * Get all elements of array of data returned by GET request and map them with T type
     * If you want specific HttpParams you should to declare them in the second parameter because
     * they have priority over RequestOptions
     */
    getAllCustom(path: string, params?: GetAllParams, requestOptions?: RequestOptions): Observable<T[]> {
        if (!path) {
            console.error('No path : impossible to get elements');
            return of(undefined);
        }
        let httpParams = new HttpParams();

        if (requestOptions && requestOptions.params) {
            for (const key of Object.keys(requestOptions.params)) {
                if (requestOptions.params[key]) {
                    httpParams = httpParams.set(key, requestOptions.params[key].toString());
                }
            }
            delete requestOptions.params;
        }
        if (params && params.filters) {
            for (const key of Object.keys(params.filters)) {
                if (params.filters[key]) {
                    httpParams = httpParams.set(key, params.filters[key].toString());
                }
            }
        }
        const allOptions = Object.assign({}, {params: httpParams}, requestOptions) as any;
        const url = this.apiRoot(path);
        return this.http.get(url, allOptions).pipe(
            map((response: any) => {
                return response ? this.geneseMapperService.arrayMap(response) : [];
            })
        );
    }



    /**
     * Get all elements with pagination
     * If the http response have paginated format, it returns paginated response with this format :
     * {
     *      totalResults?: number;
     *      results: T[];
     * }
     */
    getAllWithPagination(path: string, params: GetAllWithPaginationParams): Observable<GetAllResponse<T>> {
        if (!path) {
            console.error('No path : impossible to get paginated elements');
            return of(undefined);
        }
        if (!params || !params.pageSize) {
            console.error('Incorrect parameters : impossible to get paginated elements. The parameter pageSize must be defined.');
            return of(undefined);
        }
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageIndex !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.pageIndex, params.pageIndex.toString());
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.pageSize, params.pageSize.toString());
            }
            if (params.filters) {
                for (const key of Object.keys(params.filters)) {
                    if (params.filters[key]) {
                        httpParams = httpParams.set(key, params.filters[key].toString());
                    }
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(path);
        return this.http.get(url, options).pipe(
            map((response: any) => {
                if (response && this.isPaginatedResponse(response)) {
                    return {
                        results: this.geneseMapperService.arrayMap(response[this.geneseEnvironment.results]),
                        totalResults: response[this.geneseEnvironment.totalResults]
                    };
                } else {
                    console.error('Response is not paginated. ' +
                        'Please verify that the response includes an array corresponding to your Genese pagination environment.');
                    return undefined;
                }
            })
        );
    }



    /**
     * This method must be called when the http response is not an object, but an array (for example : ['a', 'b'])
     * The DTO model must implement the ArrayResponse interface
     *
     * Example :
     * MyModel {
     *     gnArrayResponse: [{
     *         id: '',
     *         name: ''
     *     }]
     * }
     * The getArray method will return the response array with the correct format
     */
    getArray(): Observable<any> {
        this.checkIfTTypeIsArrayResponseType();
        const url = this.apiRoot(this.getStandardPath());
        return this.http.get(url)
            .pipe(
                map((data: any) => {
                    const tObject = {
                        gnArrayResponse: data
                    };
                    return this.geneseMapperService.map(tObject) ? this.geneseMapperService.map(tObject)['gnArrayResponse'] : undefined;
                })
            );
    }



    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOne(id: string): Observable<T> {
        this.checkId(id);
        const url = this.apiRoot(this.getStandardPath(), id);
        return this.http.get(url)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.map(data);
                })
            );
    }



    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOneCustom(path: string, params?: GetOneParams): Observable<T> {
        this.checkPath(path);
        let httpParams = new HttpParams();
        if (params) {
            if (params.filters) {
                for (const key of Object.keys(params.filters)) {
                    if (params.filters[key]) {
                        httpParams = httpParams.set(key, params.filters[key].toString());
                    }
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(path);
        return this.http.get(url, options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.map(data);
                })
            );
    }



    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    request(path: string, method: RequestMethod, options?: RequestOptions): Observable<T | any> {
        this.checkPath(path);
        if (!method) {
            throw Error('Incorrect Genese method : impossible to send request');
        }
        options = Tools.default(options, {});
        if (!options.headers
            && (method === RequestMethod.POST || method === RequestMethod.PUT || method === RequestMethod.PATCH)) {
            options.headers = {'Content-Type': 'application/json'};
        }
        if (!options.observe && method === RequestMethod.DELETE) {
            options.observe = 'response';
        }
        const url = this.apiRoot(path, options.id);
        return this.http.request(method, url, options)
            .pipe(
                map((result: any) => {
                    if (method === RequestMethod.DELETE) {
                        if (options && options.mapData === false) {
                            return result;
                        } else {
                            return this.geneseMapperService.map(result ? result.body : undefined);
                        }
                    } else {
                        if (options && options.mapData === false) {
                            return result;
                        } else {
                            return this.geneseMapperService.map(result);
                        }
                    }
                })
            );
    }



    /**
     * Update an element with T type
     * @deprecated since 1.2.0. Please use put() method instead
     */
    update(id: string, updatedObject: T, options?: RequestOptions): Observable<T | any> {
        this.checkId(id);
        this.checkTType(updatedObject);
        options = Object.assign(this.getRequestOptions(options), {observe: 'body'});
        return this.http.put(this.apiRoot(this.getStandardPath()), updatedObject, options as unknown)
            .pipe(
                map(result => {
                    if (options && options.mapData === false) {
                        return result;
                    } else {
                        return this.geneseMapperService.map(result);
                    }
                })
            );
    }



    /**
     * Update an element with T type
     * @deprecated since 1.2.0. Please use put() method instead
     */
    updateCustom(path: string, body?: object, options?: RequestOptions): Observable<T | any> {
        this.checkPath(path);
        body = Tools.default(body, {});
        options = Object.assign(this.getRequestOptions(options), {observe: 'body'});
        return this.http.put(this.apiRoot(path), body, options as unknown)
            .pipe(
                map(result => {
                    if (options && options.mapData === false) {
                        return result;
                    } else {
                        return this.geneseMapperService.map(result);
                    }
                })
            );
    }


    // --------------------------------------------------
    //                   OTHER METHODS
    // --------------------------------------------------


    /**
     * Get the root path of the api
     */
    apiRoot(path?: string, id?: string): string {
        const url = path ? this.geneseEnvironment.api + path : this.geneseEnvironment.api;
        return id ? `${url}/${id}` : url;
    }



    /**
     * Check if the id is correct
     */
    checkId(id: string): void {
        if (!id || !(+id > 0)) {
            throw Error('Incorrect Genese id.');
        }
    }



    /**
     * Check if the type T implements the ArrayResponse interface.
     */
    checkIfTTypeIsArrayResponseType(): void {
        const tObject = new this.tConstructor();
        if (!tObject['gnArrayResponse']) {
            throw Error('The model must contain the gnArrayResponse property.');
        }
    }



    /**
     * Check if the path is correct
     */
    checkPath(path: string): void {
        if (!path || typeof path !== 'string') {
            throw Error('Incorrect Genese path.');
        }
    }



    /**
     * Check if the path is correct
     */
    // TODO : check nested keys
    checkTType(newObject: any): void {
        if (!newObject) {
            throw Error('Genese : there is no T object.');
        }
        if (newObject === {}) {
            throw Error('Genese : empty object.');
        }
        if (Array.isArray(newObject)) {
            throw Error('Genese : an array is not a T object.');
        }
        const tObject = new this.tConstructor();
        Object.keys(newObject).forEach(key => {
            if (!tObject.hasOwnProperty(key)) {
                throw Error('Genese : the object is not a T object');
            }
        });
    }



    /**
     * Get request options of the http request
     */
    private getRequestOptions(options: RequestOptions): any {
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        return  Object.assign(options, {observe: 'body'});
    }



    /**
     * Check if the response is paginated
     */
    private isPaginatedResponse(data: any): boolean {
        return data && Array.isArray(data[this.geneseEnvironment.results]);
    }



    /**
     * Get standard path when Genese model contains genese.path
     */
    private getStandardPath(): string {
        const model = new this.geneseMapperService.tConstructor();
        if (!model['genese'] || !model['genese'].path) {
            throw Error('No Genese path environment for the model  : impossible to get element.');
        } else {
            return model['genese'].path;
        }
    }



    /**
     * Translate data for a given language
     */
    translate(data: any, language: string): any {
        if (!language) {
            console.error('No data or no language : impossible to get element');
            return undefined;
        } else {
            return this.geneseMapperService.translate(data, language);
        }
    }
}
