import { Injectable } from '@angular/core';

// @dynamic
@Injectable()
export class Tools {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------


    constructor() { }



    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------


    /**
     * Transform string format from PascalCase to snake-case
     */
    static toSnakeCase(word: string): string {
        if (!word) {
            return '';
        }
        let snake = word.charAt(0).toLowerCase();
        for (let i = 1; i < word.length; i++) {
            if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                snake += '-' + word.charAt(i).toLowerCase();
            } else {
                snake += word.charAt(i);
            }
        }
        return snake;
    }


    /**
     * clone object with deep copy
     */
    static clone(model: any): any {
        if (model) {
            if (Array.isArray(model)) {
                const newArray = [];
                model.forEach(item => newArray.push(this.clone(item)));
                return newArray;
            } else if (typeof model === 'object') {
                const newObject = {};
                Object.keys(model).forEach(key => newObject[key] = this.clone(model[key]));
                return newObject;
            } else {
                return model;
            }
        } else {
            return model;
        }
    }


    /**
     * Check if an object is a primitive or not
     */
    static isPrimitive(target: any): boolean {
        return typeof target === 'string'
            || typeof target === 'number'
            || typeof target === 'boolean';
    }


    /**
     * Returns a value by default if value to check doesn't exists
     */
    static default(valueToCheck, valueByDefault): any {
        return valueToCheck ? valueToCheck : valueByDefault;
    }
}
