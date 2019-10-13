/*
 * Public API Surface of genese-angular
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToolsService } from './lib/services/tools.service';
import { GeneseService } from './lib/services/genese.service';
import { HttpClient } from '@angular/common/http';
import { GeneseEnvironmentService } from './lib/services/genese-environment.service';

// Root elements
export * from './lib/genese-angular.service';
export * from './lib/genese.component';
export * from './lib/genese.module';

// Services
export * from './lib/services/genese.service';
export * from './lib/services/tools.service';
export * from './lib/services/extract.service';
export * from './lib/services/genese-environment.service';

// Factories
export * from './lib/factories/genese.factory';
export * from './lib/factories/genese-mapper.factory';

// Models
export * from './lib/models/gn-request-params';
export * from './lib/models/primitive';
export * from './lib/models/t-constructor';

// Enums
export * from './lib/enums/language';
export * from './lib/enums/response-status';

@NgModule()
export class GnModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GnModule,
            providers: [
                GeneseEnvironmentService,
                ToolsService,
                {
                    provide: GeneseService,
                    deps: [HttpClient, GeneseEnvironmentService],
                    useFactory(http: HttpClient, geneseEnvironment: GeneseEnvironmentService) {
                        const service = new GeneseService(http, geneseEnvironment);
                        return service;
                    }
                }]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: GnModule,
            providers: [
                GeneseEnvironmentService,
                ToolsService,
                {
                    provide: GeneseService,
                    deps: [HttpClient, GeneseEnvironmentService],
                    useFactory(http: HttpClient, geneseEnvironment: GeneseEnvironmentService) {
                        const service = new GeneseService(http, geneseEnvironment);
                        return service;
                    }
                }]
        };
    }
}

