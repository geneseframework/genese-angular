import { Injectable } from '@angular/core';

@Injectable()
export class GeneseEnvironmentService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    public api: string;



    /* istanbul ignore next */
    constructor() { }



    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Configure Genese environment
     * @param config
     */
    setEnvironment(config: {api: string}) {
        if (config && config.api) {
            this.api = config.api;
        }
    }
}
