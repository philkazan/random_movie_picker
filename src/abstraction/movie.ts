export class Movie {
    private _title: string;
    private _year: string;
    private _poster: string;

    constructor(title: string, year: string) {
        this._title = title;
        this._year = year;
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

    set poster(poster: any) {
        this._poster = poster;
    }
}