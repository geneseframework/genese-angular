/*
 * Public API Surface of genese-angular
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToolsService } from './lib/services/tools.service';
import { GeneseService } from './lib/services/genese.service';
import { HttpClient } from '@angular/common/http';
import { GeneseEnvironmentService } from './lib/services/genese-environment.service';

export * from './lib/genese-angular.service';
export * from './lib/genese-angular.component';
export * from './lib/genese-angular.module';

export * from './lib/services/genese.service';
export * from './lib/services/tools.service';
export * from './lib/services/extract.service';
export * from './lib/services/genese-environment.service';

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

