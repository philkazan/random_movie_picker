export class Movie {
    private _category: string;
    private _id: string;
    private _poster: string;
    private _releaseYear: string;
    private _title: string;

    constructor(title: string, releaseYear: string) {
        this._title = title;
        this._releaseYear = releaseYear;
    }
    get category(): string {
        return this._category;
    }
    set id(id: string) {
        this._id = id;
    }
    get poster() {
        return this._poster;
    }
    get releaseYear() {
        return this._releaseYear;
    }
    get title() {
        return this._title;
    }
}