import { TConstructor } from '../models/t-constructor.model';
import { Tools } from '../services/tools.service';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { RequestOptions } from '../models/request-options.model';
import { ResponseStatus } from '../enums/response-status';
import { GeneseMapper } from 'genese-mapper';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


export class GeneseAngular<T, U> {


    private geneseEnvironmentService: GeneseEnvironmentService;
    private geneseMapperServiceT?: GeneseMapper<T>;
    private geneseMapperServiceU?: GeneseMapper<U>;
    private http: HttpClient;
    private readonly tConstructor?: TConstructor<T>;
    private readonly uConstructor?: TConstructor<U>;


    constructor(http: HttpClient,
                geneseEnvironmentService: GeneseEnvironmentService,
                tConstructor?: TConstructor<T>,
                uConstructor?: TConstructor<U>) {
        this.http = http;
        this.tConstructor = tConstructor;
        this.uConstructor = uConstructor;
        this.geneseMapperServiceT = tConstructor ? new GeneseMapper<T>(tConstructor) : undefined;
        this.geneseMapperServiceU = uConstructor ? new GeneseMapper<U>(uConstructor) : undefined;
        this.geneseEnvironmentService = geneseEnvironmentService;
    }


    /**
     * Deletes an element and returns success or failed status.
     * This method needs to respect Genese standard model
     */
    delete(path: string, options: RequestOptions = {}): Observable<T | ResponseStatus> {
        Tools.checkPath(path);
        const url = Tools.apiRoot(this.geneseEnvironmentService.api, path);
        Object.assign(options, {observe: 'response'});
        return this.http.delete(url, options as unknown)
            .pipe(
                map((response: HttpResponse<any>) => {
                    if (this.tConstructor) {
                        return this.geneseMapperServiceT.map(response);
                    } else {
                        return response && response.ok === true ? ResponseStatus.SUCCESS : ResponseStatus.FAILED;
                    }
                })
            );
    }


    /**
     * Calls a GET request in order to get all elements of an array and to map them with T[] type
     * @param path              the route of the endpoint
     * @param requestOptions    the options of the request
     */
    getAll(path: string, requestOptions?: RequestOptions): Observable<T[]> {
        if (!path) {
            console.error('No path : impossible to get elements');
            return of(undefined);
        }
        let httpParams = new HttpParams();
        if (requestOptions && requestOptions.queryParams) {
            for (const key of Object.keys(requestOptions.queryParams)) {
                if (requestOptions.queryParams[key]) {
                    httpParams = httpParams.set(key, requestOptions.queryParams[key].toString());
                }
            }
            delete requestOptions.queryParams;
        }
        const allOptions = Object.assign({}, {params: httpParams}, requestOptions) as any;
        const url = Tools.apiRoot(this.geneseEnvironmentService.api, path);
        return this.http.get(url, allOptions).pipe(
            map((response: any) => {
                return response ? this.geneseMapperServiceT.arrayMap(response) : [];
            })
        );
    }


    /**
     * Calls GET request and returns an object with T type
     * Warning : do not use this method in order to return an array. Use getAll() method instead.
     * @param path              the route of the endpoint
     * @param requestOptions    the options of the request
     */
    get(path: string, requestOptions?: RequestOptions): Observable<T> {
        Tools.checkPath(path);
        let httpParams = new HttpParams();
        if (requestOptions) {
            if (requestOptions.queryParams) {
                for (const key of Object.keys(requestOptions.queryParams)) {
                    if (requestOptions.queryParams[key]) {
                        httpParams = httpParams.set(key, requestOptions.queryParams[key].toString());
                    }
                }
            }
        }
        const options = {params: httpParams};
        const url = Tools.apiRoot(this.geneseEnvironmentService.api, path);
        return this.http.get(url, options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperServiceT.map(data);
                })
            );
    }


    /**
     * Calls PATCH request and returns eventually a response
     * @param path          the route of the endpoint
     * @param body          the body of the request
     * @param options       the options of the request
     */
    patch(path: string, body: any, options?: RequestOptions): Observable<T | any> {
        return this.crud('patch', path, body, options);
    }



    /**
     * Calls POST request and returns eventually a response
     * @param path          the route of the endpoint
     * @param body          the body of the request
     * @param options       the options of the request
     */
    post(path: string, body: any, options?: RequestOptions): Observable<T | any> {
        return this.crud('post', path, body, options);
    }



    /**
     * Calls PUT request and returns eventually a response
     * @param path          the route of the endpoint
     * @param body          the body of the request
     * @param options       the options of the request
     */
    put(path: string, body: any, options?: RequestOptions): Observable<T | any> {
        return this.crud('put', path, body, options);
    }



    /**
     * Experimental method
     */
    crud(requestMethod: 'patch' | 'post' | 'put', path: string, body: any, options?: RequestOptions): Observable<T | any> {
        return this.http[requestMethod](Tools.apiRoot(this.geneseEnvironmentService.api, path), body, this.getRequestOptions(options))
            .pipe(
                map((result) => {
                    if (this.tConstructor) {
                        return this.geneseMapperServiceT.map(result);
                    } else {
                        return result;
                    }
                })
            );
    }




// --------------------------------------------------
//                   OTHER METHODS
// --------------------------------------------------




    /**
     * Get request options of the http request
     */
    private getRequestOptions(options: RequestOptions): any {
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        return  Object.assign(options, {observe: 'body'});
    }


    /**
     * Get standard path when Genese model contains genese.path
     */
    private getStandardPath(): string {
        const model = new this.geneseMapperServiceT.tConstructor();
        if (!model['genese'] || !model['genese'].path) {
            throw Error('No Genese path environment for the model  : impossible to get element.');
        } else {
            return model['genese'].path;
        }
    }

}
