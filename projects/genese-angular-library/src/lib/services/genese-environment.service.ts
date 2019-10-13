import { Injectable } from '@angular/core';

@Injectable()
export class GeneseEnvironmentService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    public api: string;

    constructor() { }

    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Configure Genese environment
     */
    setEnvironment(config: {api: string}) {
        if (config && config.api) {
            this.api = config.api;
        }
    }
}
