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
        console.log('%c setEnvironment config', 'font-weight: bold; color:blue ;', config);
        if (config && config.api) {
            this.api = config.api;
            console.log('%c setEnvironment this.api', 'font-weight: bold; color:blue ;', this.api);
        }
    }
}
