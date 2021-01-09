export class BadRequestException extends Error {
    private _statusCode: string;
    constructor(message: string) {
        super(message);
    }
    get statusCode(): string {
        return this._statusCode
    }
    set statusCode(statusCode: string) {
        this._statusCode = statusCode;
    }
}