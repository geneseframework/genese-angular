import { Injectable } from '@angular/core';
import { GeneseConfig } from '../models/genese-config';
import { Tools } from './tools.service';

@Injectable()
export class GeneseEnvironmentService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    public api: string;
    public gnExtract: string;
    public gnPage: string;
    public gnLimit: string;

    constructor() { }

    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Configure Genese environment
     */
    setEnvironment(config: GeneseConfig) {
        if (config) {
            this.api = Tools.default(config.api, 'http://localhost:3000');
            this.gnExtract = Tools.default(config.extract, 'gnExtract');
            if (config.pagination) {
                this.gnPage = Tools.default(config.pagination.page, 'gnPage');
                this.gnLimit = Tools.default(config.pagination.limit, 'gnLimit');
            }
        }
    }
}
