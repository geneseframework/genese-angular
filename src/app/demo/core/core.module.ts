import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { MaterialModule } from './modules/material.module';
import { TranslateModule } from './modules/translate.module';
import { AppRoutingModule } from '../../app-routing.module';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
    declarations: [
    ],
    entryComponents: [],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        TranslateModule,

        AppRoutingModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [
        {
            provide: MatPaginatorIntl,
            deps: [TranslateService],
            useFactory: (translateService: TranslateService) => {
                const service = new PaginatorComponent();
                service.getPaginatorIntl(translateService);
                return service;
            }
        }
    ]
})
export class CoreModule {}
