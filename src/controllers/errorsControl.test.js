import { Subset } from './Subset.prototype';

describe('Subset errorsControl: ID', () => {
    it('should warn that ID cannot be null', () => {
        expect(Subset({ id: null }).validateId())
            .toEqual(expect.arrayContaining(['ID is a mandatory field']));
    });

    it('should warn that ID cannot be empty string', () => {
        expect(Subset({ id: '' }).validateId())
            .toEqual(expect.arrayContaining(['ID is a mandatory field']));
    });

    it('should warn that ID cannot be empty array', () => {
        expect(Subset({ id: [] }).validateId())
            .toEqual(expect.arrayContaining(['ID is a mandatory field']));
    });

    it('should warn if ID contains forbidden symbols: %', () => {
        expect(Subset({ id: '%' }).validateId())
            .toEqual(expect.arrayContaining([
                'Only lower case letters, numbers, dashes, and underscores are allowed'
            ])
        );
    });

    it('should warn if ID contains forbidden symbols: <', () => {
        expect(Subset({ id: '<' }).validateId())
            .toEqual(expect.arrayContaining([
                'Only lower case letters, numbers, dashes, and underscores are allowed'
            ])
        );
    });

    it('should warn if ID contains forbidden symbols: /', () => {
        expect(Subset({ id: '/' }).validateId())
            .toEqual(expect.arrayContaining([
                'Only lower case letters, numbers, dashes, and underscores are allowed'
            ])
        );
    });

    it('should warn if ID contains forbidden symbols: .', () => {
        expect(Subset({ id: '.' }).validateId('.'))
            .toEqual(expect.arrayContaining([
                'Only lower case letters, numbers, dashes, and underscores are allowed'
            ])
        );
    });

    it('should warn if ID contains forbidden symbols: =', () => {
        expect(Subset({ id: '=' }).validateId('='))
            .toEqual(expect.arrayContaining([
                'Only lower case letters, numbers, dashes, and underscores are allowed'
            ])
        );
    });

    it('should warn if ID contains forbidden symbols: upper case', () => {
        expect(Subset({ id: 'A' }).validateId('A'))
            .toEqual(expect.arrayContaining([
                'Only lower case letters, numbers, dashes, and underscores are allowed'
            ])
        );
    });
    // positive
    it('should return no warning on non empty typeof string', () => {
        expect(Subset({ id: 'some_id-123' }).validateId('some_id-123'))
            .toEqual(expect.not.arrayContaining(['ID is a mandatory field'])
        );
    });
    // positive
    it('should return no warning on non empty instanseof String', () => {
        expect(Subset({ id: new String('some_id-123') }).validateId())
            .toEqual(expect.not.arrayContaining(['ID is a mandatory field'])
        );
    });
});