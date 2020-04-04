import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneseEnvironmentService } from './genese-environment.service';
import { TConstructor } from '../models/t-constructor.model';
import { Genese } from '../factories/genese-deprecated.factory';
import { GeneseAngular } from '../factories/genese.factory';

@Injectable()
export class GeneseService {


    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService) {}


    /**
     * Return a new typed Genese instance
     * @deprecated since 1.2.0 version : please use for the instance() method
     */
    getGeneseInstance<T>(tConstructor: TConstructor<T>): Genese<T> {
        if (tConstructor) {
            return new Genese(this.http, this.geneseEnvironment, tConstructor);
        }

        return undefined;
    }


    instance();
    instance<T>(tConstructor?: TConstructor<T>);
    instance<T, U>(tConstructor?: TConstructor<T>, uConstructor?: TConstructor<U>) {
        if (!tConstructor && !uConstructor) {
            return new GeneseAngular<undefined, undefined>(this.http, this.geneseEnvironment);
        } else if (!uConstructor) {
            return new GeneseAngular<T, undefined>(this.http, this.geneseEnvironment, tConstructor);
        } else {
            return new GeneseAngular<T, U>(this.http, this.geneseEnvironment, tConstructor, uConstructor);
        }
    }


    /**
     * Return a new typed Genese instance
     * @deprecated since 1.2.0 version : please use for the instance() method
     */
    // instance<T, U>(bodyConstructor: TConstructor<T>, responseConstructor: TConstructor<U>): GeneseAngular<T, U> {
    //     if (tConstructor) {
    //         return new GeneseAngular(this.http, this.geneseEnvironment, tConstructor);
    //     }
    //
    //     return undefined;
    // }
}
