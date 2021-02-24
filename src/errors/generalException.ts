// TODO look more into .constructor
// TODO learn move about prototypes
export class GeneralException extends Error {
    _id: string;
    name: string;
    code: number;
    title: string;
    message: string;
    timestamp: string;
    causedByUri: string;
    internalException: any;

    constructor(message: string, internalException?: any) {
        super(message);
        Object.setPrototypeOf(this, GeneralException.prototype);
        this.message = message;
        this.internalException = internalException;
        this.name = this.constructor.name;
    }
}