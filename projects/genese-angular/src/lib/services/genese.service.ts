import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneseEnvironmentService } from './genese-environment.service';
import { TConstructor } from '../models/t-constructor.model';
import { Genese } from '../factories/genese-deprecated.factory';
import { GeneseAngular } from '../factories/genese-angular.factory';

@Injectable()
export class GeneseService {


    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService) {}


    /**
     * Return a new typed Genese instance
     */
    getGeneseInstance<T>(tConstructor: TConstructor<T>): Genese<T> {
        if (tConstructor) {
            return new Genese(this.http, this.geneseEnvironment, tConstructor);
        }

        return undefined;
    }


    /**
     * Experimental method for genese-api-angular
     */
    instance(): GeneseAngular<undefined, undefined>;
    instance<T>(tConstructor?: TConstructor<T>): GeneseAngular<T, undefined>;
    instance<T, U>(tConstructor?: TConstructor<T>, uConstructor?: TConstructor<U>): GeneseAngular<T, U>;
    instance<T, U>(tConstructor?: TConstructor<T>, uConstructor?: TConstructor<U>): GeneseAngular<T, U> {
        if (!tConstructor && !uConstructor) {
            return new GeneseAngular<undefined, undefined>(this.http, this.geneseEnvironment);
        } else if (!uConstructor) {
            return new GeneseAngular<T, undefined>(this.http, this.geneseEnvironment, tConstructor);
        } else {
            return new GeneseAngular<T, U>(this.http, this.geneseEnvironment, tConstructor, uConstructor);
        }
    }
}
