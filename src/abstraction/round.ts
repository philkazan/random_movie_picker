import { Movie } from './movie';
export class Round {
    private _id: number;
    private _remainingMovies: Movie[];
    private _eliminatedMovie: Movie;

    constructor(id: number) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    get remainingMovies() {
        return this._remainingMovies;
    }
    get eliminatedMovie() {
        return this._eliminatedMovie;
    }
    set remainingMovies(movies: Movie[]) {
        this._remainingMovies = movies;
    }
    set eliminatedMovie(movie: Movie) {
        this._eliminatedMovie = movie;
    }
}