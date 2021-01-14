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

    it('should overwrite validUntil for the latest published subset\'s version if it was null', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'OPEN',
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '1990-09-21T00:00:00.000Z',
            _versionValidUntil: '2000-09-21T00:00:00.000Z',          //3

            _previousVersions: [
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2000-09-21T00:00:00.000Z');

    });
});

describe('Subset prototype: updateValidityPeriod - illegal states', () => {

    it('should not overwrite validFrom for a saved version, ' +
        'when no other saved versions available', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'OPEN',  // not B, not C, not F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,                              // G
            _versionValidFrom: '1880-09-21T00:00:00.000Z',    // A, not editable actually
            _versionValidUntil: null                  // D calculated

        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validFrom for a saved version with ' +
        'validUntil set, when no other saved versions available', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'OPEN',  // not B, not C, not F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: '2000-09-21T00:00:00.000Z',  // G
            _versionValidFrom: '1880-09-21T00:00:00.000Z',   // A, not editable actually
            _versionValidUntil: '2000-09-21T00:00:00.000Z' // E, calculated

        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2000-09-21T00:00:00.000Z');

    });

    it('should not overwrite validUntil for a saved version with ' +
        'validUntil set, when the original published version available', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'OPEN',  // not B, not C, not F
            _validFrom: '1990-09-21T00:00:00.000Z',  // fetched
            _validUntil: '2000-09-21T00:00:00.000Z',  // fetched
            _versionValidFrom: '1990-09-21T00:00:00.000Z',   // A, not editable actually
            _versionValidUntil: '2222-09-21T00:00:00.000Z', // E, user input, not editable actually

            _previousVersions: [ // G
                {
                    _version: '1',
                    _administrativeStatus: 'OPEN',
                    _validFrom: '1990-09-21T00:00:00.000Z',
                    _validUntil: '2000-09-21T00:00:00.000Z',
                    _versionValidFrom: '1880-09-21T00:00:00.000Z',   // A, not editable actually
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2000-09-21T00:00:00.000Z');

    });

    it('should not overwrite validFrom or validUntil for earliest saved ' +
        'version, but mot latest', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'OPEN',  // not B, not C, not F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,                              // D
            _versionValidFrom: '1990-09-21T00:00:00.000Z',    // A
            _versionValidUntil: '2000-09-21T00:00:00.000Z', // calculated

            _previousVersions: [  // not G
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                },
                {
                    version: '2',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                }
            ]

        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validFrom or validUntil for saved subset\'s version ' +
        'in the middle of the covered period', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'OPEN',  // not B, not C, not F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,                              // D
            _versionValidFrom: '2000-09-21T00:00:00.000Z',    // A
            _versionValidUntil: '2010-09-21T00:00:00.000Z', // not G, calculated

            _previousVersions: [  // not G
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                },
                {
                    version: '2',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '2000-09-21T00:00:00.000Z',
                },
                {
                    version: '3',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '2010-09-21T00:00:00.000Z',
                }
            ]

        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validUntil in the latest saved version, if ' +
        'the versionValidUntil date are not in the acceptable period', () => {
        const given = Subset({

            _version: '1',
            _administrativeStatus: 'OPEN',              // G
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '1990-09-21T00:00:00.000Z',
            _versionValidUntil: '2301-09-21T00:00:00.000Z',          // user input, not D, not E

            _previousVersions: [
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validUntil in the new next version, if ' +
        'the versionValidUntil date are not in the acceptable period', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',         // F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',        // user input
            _versionValidUntil: '2301-09-21T00:00:00.000Z',          // user input, not D, not E

            _previousVersions: [
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validUntil in the new next version, if ' +
        'the versionValidUntil date are earlier than versionValidFrom', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',         // F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '2000-09-21T00:00:00.000Z',        // user input
            _versionValidUntil: '1850-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validUntil in the new next version, if ' +
        'the versionValidUntil date are in covered period', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',         // F
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: '2000-09-21T00:00:00.000Z',
            _versionValidFrom: '2000-09-21T00:00:00.000Z',        // user input
            _versionValidUntil: '1999-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: '2000-09-21T00:00:00.000Z',
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2000-09-21T00:00:00.000Z');

    });

    it('should not overwrite validFrom in the new previous version, if ' +
        'the versionValidFrom date are not in the acceptable period', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',      // C
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '1799-09-21T00:00:00.000Z',  // user input, not A
            _versionValidUntil: '1990-09-21T00:00:00.000Z',

            _previousVersions: [
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });

    it('should not overwrite validFrom in the new previous version, if ' +
        'the versionValidFrom date is later than versionValidUntil', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',      // C
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: null,
            _versionValidFrom: '2299-09-21T00:00:00.000Z',  // user input, not A
            _versionValidUntil: '1990-09-21T00:00:00.000Z',

            _previousVersions: [ // C
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: null,
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBeNull();

    });


    it('should not overwrite validFrom in the new previous version, if ' +
        'the versionValidFrom date is in covered period', () => {
        const given = Subset({

            _version: '2',
            _administrativeStatus: 'INTERNAL',      // C
            _validFrom: '1990-09-21T00:00:00.000Z',
            _validUntil: '2000-09-21T00:00:00.000Z',
            _versionValidFrom: '1999-09-21T00:00:00.000Z',  // user input, not A
            _versionValidUntil: '1990-09-21T00:00:00.000Z',

            _previousVersions: [ // C
                {
                    version: '1',
                    administrativeStatus: 'OPEN',
                    validFrom: '1990-09-21T00:00:00.000Z',
                    validUntil: '2000-09-21T00:00:00.000Z',
                    versionValidFrom: '1990-09-21T00:00:00.000Z',
                }
            ]
        });

        given.updateValidityPeriod();

        expect(given.validFrom).toBe('1990-09-21T00:00:00.000Z');
        expect(given.validUntil).toBe('2000-09-21T00:00:00.000Z');

    });
});
