export class Movie {
    private _actors: string;
    private _category: string;
    private _director: string;
    private _genre: string;
    private _id: string;
    private _poster: string;
    private _released: string;
    private _runTime: string;
    private _title: string;
    private _ratings: any[];
    private _imdbRating: string;
    private _metaScore: string;

    constructor(title: string, released: string) {
        this._title = title;
        this._released = released;
    }

    get actors(): string {
        return this._actors;
    }

    set actors(newValues: string) {
        this._actors = newValues;
    }

    get category(): string {
        return this._category;
    }

    set category(newValue: string) {
        this._category = newValue;
    }

    get director(): string {
        return this._director;
    }

    set director(newValue: string) {
        this._director = newValue;
    }

    get genre(): string {
        return this._genre;
    }

    set genre(newValue: string) {
        this._genre = newValue;
    }

    get poster(): string {
        return this._poster;
    }

    set poster(newValue: string) {
        this._poster = newValue;
    }

    get released(): string {
        return this._released;
    }

    set released(newValue: string) {
        this._released = newValue;
    }

    get runTime(): string {
        return this._runTime;
    }

    set runTime(newValue: string) {
        this._runTime = newValue;
    }

    get ratings(): any[] {
        return this._ratings;
    }

    set ratings(newValue: any[]) {
        this._ratings = newValue;
    }

    get imdbRating() {
        return this._imdbRating;
    }

    set imdbRating(newValue: string) {
        this._imdbRating = newValue;
    }

    get metaScore() {
        return this._metaScore;
    }

    set metaScore(newValue: string) {
        this._metaScore = newValue;
    }
    
    get title() {
        return this._title;
    }

    set title(newValue: string) {
        this._title = newValue;
    }

    set id(id: string) {
        this._id = id;
    }
}