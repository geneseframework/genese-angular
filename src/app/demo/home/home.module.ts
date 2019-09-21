import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../../app-routing.module';
import { CoreModule } from '../core/core.module';
import { DescriptionComponent } from './description/description.component';
import { MethodService } from './services/method.service';


@NgModule({
    declarations: [
        DescriptionComponent,
        HomeComponent,
    ],
    imports: [
        CoreModule,

        AppRoutingModule
    ],
    providers: [
        MethodService
    ],
    exports: [],
})
export class HomeModule { }
