import { Subset } from './Subset.prototype';

describe('Subset versionsControl: calculateVersionValidUntil', () => {
    it('should return null for an empty subset', () => {
        const given = Subset({});
        expect(given.calculateVersionValidUntil()).toBeNull();
    });

    it('should return null for en emptied subset', () => {
        const given = Subset({
            _version: 1,
            _versionValidFrom: null,
            _validUntil: null,
            _previousVersions: []
        });

        expect(given.calculateVersionValidUntil()).toBeNull();
    });

    it('should return subset\'s validUntil if no previous versions available', () => {
        const given = Subset({
            validUntil: '<script>alert(true)</script>'
        });
        expect(given.calculateVersionValidUntil()).toBeNull();
    });

    it('should return subset\'s validUntil if no previous versions available', () => {
        const given = Subset({
            validUntil: '2020-09-21T00:00:00.000Z'
        });
        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return version\'s validUntil if it is the only saved version', () => {
        const given = Subset({

            _version: 1,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: null,

            _previousVersions: [
                {
                    version: 1,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                    validUntil: '2020-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return version\'s validUntil if it is the latest saved version', () => {
        const given = Subset({

            _version: 2,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: null,

            _previousVersions: [
                {
                    version: 1,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: '2020-09-21T00:00:00.000Z'
                },
                {
                    version: 2,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                    validUntil: '2020-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return own validUntil if it is saved earlier as null', () => {
        const given = Subset({

            _version: 2,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: '2020-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: 1,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null
                },
                {
                    version: 2,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                    validUntil: null
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return next version\'s versionValidFrom if it has next version', () => {
        const given = Subset({

            _version: 1,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: '2020-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: 1,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null
                },
                {
                    version: 2,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                    validUntil: null
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2000-09-21T00:00:00.000Z');
    });

    it('should return next version\'s versionValidFrom if it has next and previous version', () => {
        const given = Subset({

            _version: 2,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: '2030-09-21T00:00:00.000Z', // could be set by user in GUI

            _previousVersions: [
                {
                    version: 1,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null
                },
                {
                    version: 2,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                    validUntil: null
                },
                {
                    version: 3,
                    versionValidFrom: '2020-09-21T00:00:00.000Z',
                    validUntil: null
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

});