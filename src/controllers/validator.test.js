import { validate } from './validator';

describe('Subset validator: ID', () => {
    it('should warn that ID cannot be null', () => {
        expect(validate.id(null)).toEqual(
            expect.arrayContaining(['ID is a mandatory field'])
        );
    });

    it('should warn that ID cannot be empty', () => {
        expect(validate.id('')).toEqual(
            expect.arrayContaining(['ID is a mandatory field'])
        );
    });

    it('should warn that ID cannot be empty array', () => {
        expect(validate.id([])).toEqual(
            expect.arrayContaining(['ID is a mandatory field'])
        );
    });

    it('should warn if ID contains forbidden symbols: %', () => {
        expect(validate.id('%')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: <', () => {
        expect(validate.id('<')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: /', () => {
        expect(validate.id('/')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: .', () => {
        expect(validate.id('.')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: =', () => {
        expect(validate.id('=')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    it('should warn if ID contains forbidden symbols: upper case', () => {
        expect(validate.id('A')).toEqual(
            expect.arrayContaining(['Only lower case letters, numbers, dashes, and underscores are allowed'])
        );
    });

    // positive
    it('should return no warning on non empty typeof string', () => {
        expect(validate.id('some_id-123')).toEqual(
            expect.not.arrayContaining(['ID is a mandatory field'])
        );
    });

    // positive
    it('should return no warning on non empty instanseof String', () => {
        expect(validate.id(new String('some_id-123'))).toEqual(
            expect.not.arrayContaining(['ID is a mandatory field'])
        );
    });

});
