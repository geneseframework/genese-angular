import { ModuleWithProviders, NgModule } from '@angular/core';
import { Tools } from './services/tools.service';
import { GeneseEnvironmentService } from './services/genese-environment.service';
import { GeneseService } from './services/genese.service';
import { HttpClient } from '@angular/common/http';
import { GeneseComponent } from './genese.component';

@NgModule({
    declarations: [GeneseComponent],
    imports: [
    ],
    providers: [
        GeneseEnvironmentService,
        Tools,
    ],
    exports: [GeneseComponent]
})
export class GeneseModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GeneseModule,
            providers: [
                GeneseEnvironmentService,
                Tools,
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
            ngModule: GeneseModule,
            providers: [
                GeneseEnvironmentService,
                Tools,
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
