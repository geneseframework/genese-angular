import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Books } from '../models/books.model';
import { GeneseAbstract } from '../../../genese-core/services/genese-abstract.service';


@Injectable({providedIn: 'root'})
export class BookDataService extends GeneseAbstract<Books> {

    constructor(http: HttpClient) {
        super(http, Books);
    }
}
