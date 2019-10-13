import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToolsService } from './services/tools.service';
import { GeneseEnvironmentService } from './services/genese-environment.service';
import { GeneseService } from './services/genese.service';
import { HttpClient } from '@angular/common/http';
import { GeneseAngularComponent } from './genese-angular.component';

@NgModule({
    declarations: [GeneseAngularComponent],
    imports: [
    ],
    providers: [
        GeneseEnvironmentService,
        ToolsService,
    ],
    exports: [GeneseAngularComponent]
})
export class GeneseAngularLibraryModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GeneseAngularLibraryModule,
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
            ngModule: GeneseAngularLibraryModule,
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
