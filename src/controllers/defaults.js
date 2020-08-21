export const languages = [
    {languageCode: 'nb', IETF: 'nb-NO', full: 'Norsk bokmål', default: true},
    {languageCode: 'nn', IETF: 'nn-NO', full: 'Nynorsk'},
    {languageCode: 'en', IETF: 'en-US', full: 'English'}
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