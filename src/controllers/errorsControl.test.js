/*
import { errorsControl } from './errorsControl';

describe('Subset validator: ID', () => {
    it('should warn that ID cannot be null', () => {
        expect(errorsControl.validate(null)).toEqual(
            expect.arrayContaining(['ID is a mandatory field'])
        );
    });

    it('should warn that ID cannot be empty', () => {
        expect(errorsControl.validateId('')).toEqual(
            expect.arrayContaining(['ID is a mandatory field'])
        );
    });

    it('should warn that ID cannot be empty array', () => {
        expect(errorsControl.validateId([])).toEqual(
            expect.arrayContaining(['ID is a mandatory field'])
        );
    });

    it('should warn if ID contains forbidden symbols: %', () => {
        expect(errorsControl.validateId('%')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: <', () => {
        expect(errorsControl.validateId('<')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: /', () => {
        expect(errorsControl.validateId('/')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: .', () => {
        expect(errorsControl.validateId('.')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: =', () => {
        expect(errorsControl.validateId('=')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: upper case', () => {
        expect(errorsControl.validateId('A')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    // positive
    it('should return no warning on non empty typeof string', () => {
        expect(errorsControl.validateId('some_id-123')).toEqual(
            expect.not.arrayContaining(['ID is a mandatory field'])
        );
    });

    // positive
    it('should return no warning on non empty instanseof String', () => {
        expect(errorsControl.validateId(new String('some_id-123'))).toEqual(
            expect.not.arrayContaining(['ID is a mandatory field'])
        );
    });

});
*/
