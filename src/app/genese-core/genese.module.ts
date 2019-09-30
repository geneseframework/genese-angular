import { NgModule } from '@angular/core';
import { ToolsService } from './services/tools.service';
import { GeneseService } from './services/genese.service';
import { GeneseEnvironmentService } from './services/genese-environment.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        ToolsService,
        GeneseEnvironmentService,
        GeneseService
    ]
})
export class GeneseModule {}
