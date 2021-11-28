import { BadRequestException } from '../errors/badRequestException';
import {Movie} from '../resource/movie';

export class MovieValidator {
    // has some method called validate
    // method takes in a Movie object
    // start with a simple concatenated string for error message
    // then maybe figure out nested errors
    private _validationException: string = '';

    
    validate(movie: Movie) {
        this.validateRequiredStringField(movie.title, 'title');
        this.validateRequiredStringField(movie.category, 'category');
        this.validateRequiredStringField(movie.poster, 'poster');
        this.validateRequiredStringField(movie.released, 'released');

        if (this._validationException) {
            throw new BadRequestException(this._validationException);
        }
    }

    validateRequiredStringField(field: string, fieldName: string) {
        if (typeof field !== 'string') {
            this._validationException += `Movie's ${fieldName} attribute must be a string.`
        }

        if (!field || field.trim() === '') {
            this._validationException += `Movie's ${fieldName} attribute is required.`;
        }
    }
}