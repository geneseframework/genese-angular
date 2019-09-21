import { Injectable } from '@angular/core';

@Injectable()
export class ExtractService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------


    constructor() { }



    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Extract all the fields of some data corresponding to a given extraction model
     * @param data
     * @param extractionModel
     */
    static extractFieldsFromData(data: any, extractionModel: any): any {
        if (!extractionModel) {
            return data;
        }
        const result = {};
        for (const key of Object.keys(extractionModel)) {
            Object.assign(result, {[key]: this.extractFieldsForOneProperty(data, key, extractionModel[key])});
        }
        return result;
    }


    /**
     * For a given key of an extraction model and with the path corresponding of this key,
     * returns the fields from data which have the same key for the same path
     * @param data
     * @param key
     * @param pathExtraction
     */
    static extractFieldsForOneProperty(data: any, key: string, pathExtraction: string): object {
        const extracts = [];
        if (Array.isArray(data)) {
            for (const element of data) {
                extracts.push(this.extractFieldsForOneProperty(element, key, pathExtraction));
            }
        } else {
            return ExtractService.extractValue(data, key, pathExtraction);
        }
        return extracts;
    }


    /**
     * With a given key and a given path, extracts the value of a data object for this key and this path
     * @param data
     * @param key
     * @param path
     */
    static extractValue(data: any, key: string, path: string): any {
        if (!data || !path || typeof path !== 'string') {
            return data;
        }
        const branches: string[] = path.split('.');
        let value;
        for (const branch of branches) {
            if (!value) {
                value = data[branch];
            } else {
                value = value[branch];
            }
        }
        return value;
    }
}
