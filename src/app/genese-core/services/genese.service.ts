import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneseEnvironmentService } from './genese-environment.service';
import { TConstructor } from '../models/t-constructor';
import { Genese } from '../factories/genese.factory';

@Injectable()
export class GeneseService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    /* istanbul ignore next */
    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService) {}

    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Return a new typed Genese instance
     * @param tConstructor
     */
    /* istanbul ignore next */
    getGeneseInstance<T>(tConstructor: TConstructor<T>): Genese<T> {
        if (tConstructor) {
            return new Genese(this.http, this.geneseEnvironment, tConstructor);
        }

        return undefined;
    }
}
