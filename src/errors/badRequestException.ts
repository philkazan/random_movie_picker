import {GeneralException} from './generalException';

export class BadRequestException extends GeneralException {
    constructor(message: string = 'Bad Request.') {
        super(message);
        Object.setPrototypeOf(this,BadRequestException.prototype);
        this.name = this.constructor.name;
        this.message = message;
        this.code = 400;
    }
}