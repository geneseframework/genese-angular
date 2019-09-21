import { HttpClient } from '@angular/common/http';
import { TConstructor } from '../models/t-constructor';
import { GeneseAbstract } from './genese-abstract.service';


export class Genese<T> extends GeneseAbstract<T> {

    constructor(http: HttpClient, tConstructor: TConstructor<T>) {
        super(http, tConstructor);
    }
}
