import { TConstructor } from './t-constructor.model';
import { RequestMethod } from '../enums/request-method';

export class Endpoint {
    path: string;
    restAction: RequestMethod;
    dataType: TConstructor<any>;

}
