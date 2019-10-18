import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneseEnvironmentService } from './genese-environment.service';
import { TConstructor } from '../models/t-constructor.model';
import { Genese } from '../factories/genese.factory';

@Injectable()
export class GeneseService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService) {}

    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Return a new typed Genese instance
     * @param tConstructor
     */
    getGeneseInstance<T>(tConstructor: TConstructor<T>): Genese<T> {
        if (tConstructor) {
            return new Genese(this.http, this.geneseEnvironment, tConstructor);
        }

        return undefined;
    }
}
