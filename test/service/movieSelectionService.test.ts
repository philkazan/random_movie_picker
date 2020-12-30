import 'mocha';
import * as TestMovie from './data/movie.json';
import * as TestMovies from './data/movies.json';
import { expect } from 'chai';
import { MovieSelectionService } from '../../src/service/movieSelectionService';


describe('MovieSelectionService', () => {

    const testService = new MovieSelectionService();

    describe('getAvailableMovies', () => {
        it('should return array of Movies', () => {
            const result = testService.getAvailableMovies();
            expect(result).to.deep.equal(TestMovies);
        })
    })
    describe('getRandomMovie', () => {
        it('should return a Movie', () => {
            const result = testService.getRandomMovie();
            expect(result).to.have.all.keys('releaseYear','title', 'poster', 'hasBeenWatched');
        })
    })
})