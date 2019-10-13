import { ToolsService } from '../services/tools.service';
import { TConstructor } from '../models/t-constructor';
import { ExtractService } from '../services/extract.service';
import { Language } from '../enums/language';
import { PRIMITIVES } from '../models/primitive';

export class GeneseMapperFactory<T> {

    // --------------------------------------------------
    //                     PROPERTIES
    // --------------------------------------------------

    readonly tConstructor: TConstructor<T>;

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    /**
     * The constructor takes a Class as parameter.
     * The tConstructor property is an object with the Type corresponding to this Class
     * @param tConstructor
     */
    constructor(tConstructor: TConstructor<T>) {
        this.tConstructor = tConstructor;
    }


    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * The core of the generic mapper
     * If uConstructor is undefined, U equals T and this methodName returns a mapped T object
     * If not, it returns a mapped U object
     * uConstructor is useful for extraction of given fields of a T class object
     */
    public mapToObject<U = T>(data: any, uConstructor?: TConstructor<U>): U {
        if (!data) {
            const target = uConstructor ? new uConstructor() : new this.tConstructor();
            return target as U;
        }
        const tObject = new this.tConstructor();
        if (uConstructor) {
            let uObject = new uConstructor();
            if (uConstructor.hasOwnProperty('gnRename')) {
                data = this._rename(uConstructor, data);
            }
            uObject = Object.assign(uObject, ExtractService.extractFieldsFromData(tObject, uObject));
            uObject = Object.assign(uObject, this._diveMap<U>(uObject, data));
            return uObject;
        } else {
            if (this.tConstructor.hasOwnProperty('gnRename')) {
                data = this._rename(this.tConstructor, data);
            }
            const target = new this.tConstructor();
            return Object.assign(target, this._diveMap<T>(target, data));
        }
    }

    /**
     * Returns array of mapped results
     */
    mapGetAllResults<U = T>(data: any[], uConstructor?: TConstructor<U>): U[] {
        const gConstructor = uConstructor ? uConstructor : this.tConstructor;
        const results: any[] = [];
        if (PRIMITIVES.includes(gConstructor.name)) {
            data.forEach(e => {
                const newElement = typeof e === gConstructor.name.toLowerCase() ? e : undefined;
                results.push(newElement);
            });
        } else {
            data.forEach(e => {
                results.push(uConstructor ? this.mapToObject<U>(e, uConstructor) : this.mapToObject<T>(e));
            });
        }
        return results;
    }


    /**
     * If a property of the U class have the decorator @GnRename, this methodName replaces the key of the gnRename http param
     * This methodName is useful when the backend renamed some DTO properties :
     * with @GnRename decorator, you can get values from backend without changing the property name of your T objects in every file
     * @param uConstructor
     * @param data
     */
    _rename<U>(uConstructor: TConstructor<U>, data: any): any {
        const constr: any = uConstructor;
        Object.keys(constr.gnRename).map(oldKey => {
            const newKey = constr.gnRename[oldKey];
            if (data[newKey]) {
                data[oldKey] = data[newKey];
                delete data[newKey];
            }
        });
        return data;
    }


    /**
     * For a given object with U type (the target model), returns the source object mapped with the U model
     * @param target
     * @param source
     */
    _diveMap<U>(target: U, source: any): any {
        if (ToolsService.isPrimitive(target)) {
            return ToolsService.isPrimitive(source) ? this._cast(target, source) : target;
        } else {
            return this._mapNotPrimitive(target, source);
        }
    }


    /**
     * For non-primitive objects, returns source object mapped with the type of the target (U)
     * @param target
     * @param source
     */
    _mapNotPrimitive<U>(target: U, source: any): any {
        let cloneTarget = Object.assign({}, target);
        for (const key of Object.keys(target)) {
            if (key === 'gnKey') {
                cloneTarget = this._mapIndexableType(target[key], source);
            }
            if (target[key] !== undefined) {
                if (this._stringOrNumber(target[key], source[key])) {
                    if (Array.isArray(target[key])) {
                        cloneTarget[key] = this._mapArrayOfObjects(target[key], source[key]);
                    } else {
                        const cast = this._cast(target[key], source[key]);
                        if (typeof cast === 'object') {
                            cloneTarget[key] = this._diveMap(target[key], source[key]);
                        } else {
                            cloneTarget[key] = cast;
                        }
                    }
                }
            }
        }
        return cloneTarget;
    }


    /**
     * When an object haves a field named 'gnKey', that means that this object haves a model like this :
     * public myProperty?: {
     *   [key: string]: {
     *       type: string
     *      }
     *   } = {
     *      gnKey: {
     *           type: ''
     *      }
     *  };
     * For each key of gnKey, this methodName returns the corresponding mapped object with the target model
     * @param target
     * @param source
     */
    _mapIndexableType(target: any, source: any): any {
        const mappedObject = {};
        for (const key of Object.keys(source)) {
            Object.assign(mappedObject, { [key]: this._diveMap(target, source[key])});
        }
        return mappedObject;
    }


    /**
     * Check if two objects are both string or number.
     * In this case, returns true.
     * @param target
     * @param source
     */
    _stringOrNumber(target: any, source: any): boolean {
        return typeof target === typeof source
            || (typeof target === 'string' && typeof source === 'number')
            || (typeof target === 'number' && typeof source === 'string' && !isNaN(Number(source)));
    }


    /**
     * If source and target are both string or number, we cast them into the target's type
     * This methodName adds a tolerance for http requests which returns numbers instead of strings and inversely
     * @param target
     * @param source
     */
    _cast(target: any, source: any): any {
        if (typeof target === typeof source) {
            return source;
        } else if (typeof target === 'string' && typeof source === 'number') {
            return  source.toString();
        } else if (typeof target === 'number' && typeof source === 'string') {
            return +source;
        } else {
            return source;
        }
    }


    /**
     * Mapper to array of objects
     * @param target
     * @param source
     */
    _mapArrayOfObjects(target: any[], source: any[]): any[] {
        const arrayOfObjects: any[] = [];
        const model = ToolsService.clone(target[0]);
        for (const element of source) {
            arrayOfObjects.push(this._diveMap(model, element));
        }
        return arrayOfObjects;
    }


    /**
     * If data object with type U have keys 'gnTranslate', this methodName returns the same object removing gnTranslate key
     * and preserving only the gnTranslate[language] objects
     * Example :
     * if data is like
     * {
     *     gnTranslate: {
     *         fr: {
     *             country: 'Allemagne'
     *         },
     *         en: {
     *             country: 'Germany'
     *         }
     *     }
     * }
     * and if language is 'fr', his methodName will return
     * {
     *     country: 'Allemagne'
     * }
     * @param data
     * @param language
     */
    public translate<U = T>(data: U, language: Language): U {
        if (!language) {
            console.error('No data or no language : impossible to get element');
            return undefined;
        } else {
            const result = ToolsService.clone(data);
            Object.keys(result).map(key => {
                if (key === 'gnTranslate') {
                    Object.assign(result, result.gnTranslate[language]);
                    delete result.gnTranslate;
                } else {
                    if (typeof result[key] === 'object') {
                        const clone = ToolsService.clone(result[key]);
                        result[key] = this.translate(clone, language);
                    }
                }
            });
            return result;
        }
    }
}
