import { Movie } from '../resource/movie';

export class MovieSelectionService { 
    getAvailableMovies() {
        const inputFile: Movie[] = require('../../input/movies.json');
        return inputFile;
    }

    getRandomMovie() {
        const availableMovies: Movie[] = require('../../input/movies.json');
        const randomIndex = Math.floor(Math.random() * availableMovies.length)
        return availableMovies[randomIndex];
    }

    addMovie() {
        // not implemented
    }

    editMovie() {
        // not implemented
    }
} 