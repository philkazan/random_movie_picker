import { BadRequestException } from '../exceptions/badRequestException';
import {Movie} from '../resource/movie';

export class MovieValidator {
    // has some method called validate
    // method takes in a Movie object
    // start with a simple concatenated string for error message
    // then maybe figure out nested errors
    private _validationException: string;

    
    validate(movie: Movie) {
        if (typeof movie.title !== 'string') {
            this._validationException += ' Movie must be a string.'
        }
        if (!movie.title || movie.title.trim() === '') {
            this._validationException += ' Movie title is missing.'
        }
        if (typeof movie.poster !== 'string') {
            this._validationException += ' Movie\'s poster must be a string.'
        }
        if ( !movie.poster || movie.poster.trim() === '') {
            this._validationException += ' Movie poster is missing.'
        }
        if (typeof movie.year !== 'string') {
            this._validationException += ' Movie.year must be a string'
        }
        if ( !movie.year || movie.year.trim() === '') {
            this._validationException += ' Movie year is missing';
        }

        if (this._validationException) {
            throw new BadRequestException(this._validationException);
        }
    }
}