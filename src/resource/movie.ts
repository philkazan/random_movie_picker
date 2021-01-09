export class Movie {
    private _title: string;
    private _year: string;
    private _poster: string;
    private _id: string;

    constructor(title: string, year: string) {
        this._title = title;
        this._year = year;
    }
    set id(id: string) {
        this._id = id;
    }
    get title() {
        return this._title;
    }
    get year() {
        return this._year;
    }
    get poster() {
        return this._poster;
    }
}