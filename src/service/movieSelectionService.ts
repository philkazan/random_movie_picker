import { Movie } from '../abstraction/movie';
import { Round } from '../abstraction/round';
import { MovieSelectionResult } from '../abstraction/movieSelectionResult';
import * as fs from 'fs';

export class MovieSelectionService { 
    getMoviePoster(movieTitle: string) {
            // return fs.readFileSync(`${__dirname}/movie_posters/${movieTitle}.jpg`);
    }

    getAvailableMovies() {
        const inputFile: Movie[] = require('../input/movies.json');
        return inputFile;
    }

    getRandomMovie() {
        const inputFile: Movie[] = require('../input/movies.json');
        const availableMovies: Movie[] = [...inputFile]
        const result = new MovieSelectionResult();
        let roundNumber: number = 1;

        while(availableMovies.length > 0) {
            const round = new Round(roundNumber);
            const randomIndex = Math.floor(Math.random() * availableMovies.length)
            const randomMovie = availableMovies[randomIndex];
            availableMovies.splice(randomIndex, 1);

            round.remainingMovies = [...availableMovies];
            round.eliminatedMovie = randomMovie;
            result.addToRounds(round);

            if (availableMovies.length === 0) {
                result.selectedMovie = randomMovie;
            } else {
                roundNumber++;
            }
        }
        return result;
    }
} 