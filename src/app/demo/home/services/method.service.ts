import { Injectable } from '@angular/core';
import { Method } from '../models/method.model';

@Injectable()
export class MethodService {

    constructor() {}

    getMethod(name: string): Method {
        const method: Method = METHODS.find(e => e.name === name);
        return method ? method : {};
    }
}

export const METHODS: Method[] = [
    {
        name: 'getOne',
        signature: 'getOne(id: string): Observable<T>',
        description: ''
    },
    {
        name: 'getOne',
        signature: '',
        description: ''
    },
    {
        name: 'getOne',
        signature: '',
        description: ''
    },
    {
        name: 'getOne',
        signature: '',
        description: ''
    },
    {
        name: 'getOne',
        signature: '',
        description: ''
    },
    {
        name: 'getOne',
        signature: '',
        description: ''
    },
];

