import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { Tools } from './services/tools.service';
import { GeneseEnvironmentService } from './services/genese-environment.service';
import { GeneseService } from './services/genese.service';
import { HttpClient } from '@angular/common/http';
import { GeneseComponent } from './genese.component';

export function useFactory(http: HttpClient, geneseEnvironment: GeneseEnvironmentService) {
    console.log('%c useFactory geneseEnvironment', 'font-weight: bold; color: red;', geneseEnvironment);
    if (geneseEnvironment instanceof Function) {
        console.log('%c useFactory geneseEnvironment IS instance of Function', 'font-weight: bold; color: brown;', geneseEnvironment);
    } else {
        console.log('%c useFactory geneseEnvironment IS instance of Function', 'font-weight: bold; color: brown;', geneseEnvironment);
    }
    const service = new GeneseService(http, geneseEnvironment);
    console.log('%c useFactory service', 'font-weight: bold; color: red;', service);
    return service;
}

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
                    useFactory
                }
                // },
                // {
                //     provide: APP_INITIALIZER,
                //     multi: true,
                //     useFactory
                // }
            ]
        };
    }
}
