import {GeneralException} from './generalException';

export class NotFoundException extends GeneralException {
    constructor(message: string = 'Bad Request.') {
        super(message);
        Object.setPrototypeOf(this,NotFoundException.prototype);
        this.name = this.constructor.name;
        this.message = message;
        this.code = 404;
    }
}