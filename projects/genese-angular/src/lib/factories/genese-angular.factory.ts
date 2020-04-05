import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TConstructor } from '../models/t-constructor.model';
import { Tools } from '../services/tools.service';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { RequestMethod } from '../enums/request-method';
import { RequestOptions } from '../models/request-options.model';
import { GeneseMapper } from 'genese-mapper';
import { Endpoint } from '../models/endpoint';


export class GeneseAngular<T, U> {


    private geneseEnvironmentService: GeneseEnvironmentService;
    private geneseMapperServiceT?: GeneseMapper<T>;
    private geneseMapperServiceU?: GeneseMapper<U>;
    private http: HttpClient;
    private readonly tConstructor?: TConstructor<T>;
    private readonly uConstructor?: TConstructor<U>;


    constructor(http: HttpClient, geneseEnvironmentService: GeneseEnvironmentService);
    constructor(http: HttpClient, geneseEnvironmentService: GeneseEnvironmentService, tConstructor?: TConstructor<T>);
    // tslint:disable-next-line:unified-signatures max-line-length
    constructor(http: HttpClient, geneseEnvironmentService: GeneseEnvironmentService, tConstructor?: TConstructor<T>, uConstructor?: TConstructor<U>);
    // tslint:disable-next-line:max-line-length
    constructor(http: HttpClient, geneseEnvironmentService: GeneseEnvironmentService, tConstructor?: TConstructor<T>, uConstructor?: TConstructor<U>) {
        this.http = http;
        this.tConstructor = tConstructor;
        this.uConstructor = uConstructor;
        this.geneseMapperServiceT = tConstructor ? new GeneseMapper<T>(tConstructor) : undefined;
        this.geneseMapperServiceU = uConstructor ? new GeneseMapper<U>(uConstructor) : undefined;
        this.geneseEnvironmentService = geneseEnvironmentService;
    }



    /**
     * Experimental method
     */
    get(idOrPath: string, requestOptions?: RequestOptions): Observable<T> {
        if (!idOrPath || typeof idOrPath !== 'string') {
            console.error('No path : impossible to get elements');
            return of(undefined);
        }
        return (this.isPath(idOrPath)) ? this.getOneCustom(idOrPath, requestOptions) : this.getOne(idOrPath, requestOptions);
    }



    /**
     * Experimental method
     */
    patch(path: string, body: any, options?: RequestOptions): Observable<U | any> {
        return this.crud('patch', path, body, options);
    }



    /**
     * Experimental method
     */
    post(path: string, body: any, options?: RequestOptions): Observable<U | any> {
        return this.crud('post', path, body, options);
    }



    /**
     * Experimental method
     */
    put(path: string, body: any, options?: RequestOptions): Observable<U | any> {
        return this.crud('put', path, body, options);
    }



    /**
     * Experimental method
     */
    crud(requestMethod: 'patch' | 'post' | 'put', path: string, body: any, options?: RequestOptions): Observable<U | any> {
        return this.http[requestMethod](this.apiRoot(path), body, this.getRequestOptions(options))
            .pipe(
                map((result) => {
                    if (options && options.mapData === false) {
                        return result;
                    } else if (this.uConstructor) {
                        return this.geneseMapperServiceU.map(result);
                    }
                })
            );
    }



    /**
     * Experimental method
     */
    rest(endpoint: Endpoint, body?: any, options?: RequestOptions): Observable<U | any> {
        this.checkEndpoint(endpoint);
        switch (endpoint.restAction) {
            case RequestMethod.GET:
                return;
            case RequestMethod.POST:
                return this.post(endpoint.path, body, options);
            default:
                throw Error('Incorrect REST action');
        }
    }



    checkEndpoint(endpoint: Endpoint): void {
        if (!endpoint?.restAction || !endpoint?.path) {
            throw Error('Endpoint or path missing');
        }
    }




    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOne(id: string, requestOptions?: RequestOptions): Observable<T> {
        this.checkId(id);
        const url = this.apiRoot(this.getStandardPath(), id);
        return this.http.get(url)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperServiceT.map(data);
                })
            );
    }


    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOneCustom(path: string, requestOptions?: RequestOptions): Observable<T> {
        this.checkPath(path);
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
        const url = this.apiRoot(path);
        return this.http.get(url, options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperServiceT.map(data);
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
        const url = path ? this.geneseEnvironmentService.api + path : this.geneseEnvironmentService.api;
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
     * Check if the path is correct
     */
    checkPath(path: string): void {
        if (!path || typeof path !== 'string') {
            throw Error('Incorrect Genese path.');
        }
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



    isPath(str: string): boolean {
        return /^\/[-a-zA-Z0-9@:%.{}_+~#=]?/.test(str);
    }

}
