import { Subset } from './Subset.prototype';

describe('Subset versionsControl: calculateVersionValidUntil', () => {
    it('should return null for an empty subset', () => {
        const given = Subset({});
        expect(given.calculateVersionValidUntil()).toBeNull();
    });

    it('should return null for en emptied subset', () => {
        const given = Subset({
            _version: '1',
            _validUntil: null,
            _versionValidFrom: null,
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

            _version: '1',
            _validUntil: null,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    validUntil: '2020-09-21T00:00:00.000Z',
                    versionValidFrom: '2000-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return version\'s validUntil if it is the latest saved version', () => {
        const given = Subset({

            _version: '2',
            _validUntil: null,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    validUntil: '2020-09-21T00:00:00.000Z',
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                },
                {
                    version: '2',
                    validUntil: '2020-09-21T00:00:00.000Z',
                    versionValidFrom: '2000-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return own validUntil if it is saved earlier as null', () => {
        const given = Subset({

            _version: '2',
            _validUntil: '2020-09-21T00:00:00.000Z',
            _versionValidFrom: '2000-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                },
                {
                    version: '2',
                    validUntil: null,
                    versionValidFrom: '2000-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return next version\'s versionValidFrom if it has next version', () => {
        const given = Subset({

            _version: '1',
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: '2020-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                },
                {
                    version: '2',
                    validUntil: null,
                    versionValidFrom: '2000-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2000-09-21T00:00:00.000Z');
    });

    it('should return next version\'s versionValidFrom if it has next and previous version', () => {
        const given = Subset({

            _version: '2',
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _validUntil: '2030-09-21T00:00:00.000Z', // could be set by user in GUI

            _previousVersions: [
                {
                    version: '1',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                },
                {
                    version: '2',
                    validUntil: null,
                    versionValidFrom: '2000-09-21T00:00:00.000Z'
                },
                {
                    version: '3',
                    validUntil: null,
                    versionValidFrom: '2020-09-21T00:00:00.000Z'
                }
            ]
        });

        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

});

describe('Subset prototype: updateValidityPeriod - legal states', () => {
    it('should overwrite validFrom and validUntil for new subset\'s versions', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'INTERNAL',
            _validFrom: null,
            _validUntil: null,
            _versionValidFrom: '1990-09-21T00:00:00.000Z',
            _versionValidUntil: '2000-09-21T00:00:00.000Z'

        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2000-09-21T00:00:00.000Z');

    });

    it('should overwrite validFrom for new earlier subset\'s versions', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '1980-09-21T00:00:00.000Z',
            _versionValidUntil: '1990-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1980-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should set validUntil for new later subset\'s versions', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _versionValidUntil: '2010-09-21T00:00:00.000Z', //4

            _previousVersions: [
                {
                    version: '1',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: '2000-09-21T00:00:00.000Z', //1
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2010-09-21T00:00:00.000Z');

    });

    it('should overwrite validUntil for new later subset\'s versions', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _versionValidUntil: '2010-09-21T00:00:00.000Z', //4

            _previousVersions: [
                {
                    version: '1',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,                          //2
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2010-09-21T00:00:00.000Z');

    });

    it('should set to null validUntil for new later subset\'s versions', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: '2000-09-21T00:00:00.000Z',
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _versionValidUntil: null,                        //3

            _previousVersions: [
                {
                    version: '1',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: '2000-09-21T00:00:00.000Z', //1
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should keep validUntil as null for new later subset\'s versions', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: '2000-09-21T00:00:00.000Z',
            _versionValidFrom: '2000-09-21T00:00:00.000Z',
            _versionValidUntil: null,                        //3

            _previousVersions: [
                {
                    version: '1',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null, //2
                    versionValidFrom: '1990-09-21T00:00:00.000Z'
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });
});
