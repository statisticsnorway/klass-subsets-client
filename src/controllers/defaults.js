export const languages = [
    { languageCode: 'nb', IETF: 'nb-NO', full: 'Norsk bokmål', default: true },
    { languageCode: 'nn', IETF: 'nn-NO', full: 'Nynorsk' },
    { languageCode: 'en', IETF: 'en-US', full: 'English' }
];

export const subsetDraft = {
    namePrefix: 'Uttrekk for ',
    maxLengthId: 128,
    maxLengthName: 250,
    maxLengthShortName: 250,
    maxLengthDescription: 2500,
    maxLengthVersionRationale: 2500
};

// TODO: defaults for subset description in different languages

export const STATUS_ENUM = [
    'DEPRECATED',
    'DRAFT',
    'INTERNAL',
    'OPEN'
];

export const LANGUAGE_CODE_ENUM = [
    'en',
    'nb',
    'nn'
];

export const acceptablePeriod = {
    from: new Date('1800-01-01').toISOString(),
    until: new Date('2300-01-01').toISOString()
};