
export class Books {

    @GnRename('isAvailable')
    public available = false;

    @GnRename('bookTitle')
    public title ?= '';

    public id ?= '';
    public author ?= '';


    public categories?: string[] = [''];
    public codes?: number[] = [0];
    public description ? = '';
    public editions?: [{
        name?: string,
        year?: string,
        gnTranslate ?: {
            [key: string]: {
                country: string
            }
        }
    }] = [{
        name: '',
        year: '',
        gnTranslate: {
            gnKey: {
                country: ''
            }
        }
    }];
    public editor?: {
        name?: string,
        place?: {
            city?: string,
            country?: string
        }
    } = {
        name: '',
        place: {
            city: '',
            country: ''
        }
    };

    public year ?= '';
    public gnTranslate?: {
        [key: string]: {
            type: string
        }
    } = {
        gnKey: {
            type: ''
        }
    };
}

export class LightBookEditor {
    name ?= 'editor.name';
    // city ?= 'editor.place.city';
    country ?= 'editor.place.country';
    @GnRename('bookTitle')
    title ?= 'title';
    // myEditor ?= 'editor';
    editions ?= 'editions';
}

export function GnRename(backendProperty: string) {
    // tslint:disable-next-line:only-arrow-functions
    return function(target: any, propertyKey: string) {
        console.log('%c GnRename target ', 'font-weight: bold; color: fuchsia;', target);
        if (!target.constructor.gnRename) {
            target.constructor.gnRename = {};
        }
        target.constructor.gnRename[propertyKey] = backendProperty;
    };
}
