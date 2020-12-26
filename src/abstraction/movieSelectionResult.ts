import { Movie } from './movie';
import { Round } from './round';

export class MovieSelectionResult {
    private _selectedMovie: Movie;
    private _rounds: Round[] = [];

    get selectedMovie() {
        return this._selectedMovie;
    }
    get rounds() {
        return this._rounds;
    }

    set selectedMovie(movie: Movie) {
        this._selectedMovie = movie;
    }

    addToRounds(round: Round) {
        this._rounds.push(round);
    }
}