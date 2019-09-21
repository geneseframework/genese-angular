import { GeneseAbstract } from '../services/genese-abstract.service';
import { GeneseModelMock } from './genese-model.mock';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ImplementationGenericDataService extends GeneseAbstract<GeneseModelMock> {

    public gnApiPath = '/api/generics/';
    public mappedObject: any;

    constructor(protected http: HttpClient) {
        super(http, GeneseModelMock);
    }




    /**
     * Mock Mapper of generic mapToGetAll()
     * @param data
     */
    mapToGetAll(data: any): any {
        const element: GeneseModelMock = {};
        if (data) {
            element.name = 'name received with implemented mapToGetAll()';
        }
        return element;
    }
}
