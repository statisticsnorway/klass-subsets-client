import { Subset } from './Subset.prototype';

describe('Subset prototype: default values', () => {
    it('should by default set ID to empty string', () => {
        expect(Subset().id).toBe('');
    });

    it('should by default set shortName to empty string', () => {
        expect(Subset().shortName).toBe('');
    });

    it('should by default set shortName to empty array', () => {
        expect(Subset().name).toEqual([]);
    });

    it('should by default set administrativeStatus to INTERNAL', () => {
        expect(Subset().administrativeStatus).toBe('INTERNAL');
    });

    it('should by default set validFrom to null', () => {
        expect(Subset().validFrom).toBeNull();
    });

    it('should by default set validUntil to null', () => {
        expect(Subset().validUntil).toBeNull();
    });

    it('should by default set createdBy to empty string', () => {
        expect(Subset().createdBy).toBe('');
    });

    it('should by default set subject to empty string', () => {
        expect(Subset().subject).toBe('');
    });

    it('should by default set description to empty array', () => {
        expect(Subset().description).toEqual([]);
    });

    it('should by default set version to 1', () => {
        expect(Subset().version).toBe('1');
    });

    it('should by default set versionRationale to empty array', () => {
        expect(Subset().versionRationale).toEqual([]);
    });

    it('should by default set versionValidUntil to null', () => {
        expect(Subset().versionValidUntil).toBeNull();
    });

    it('should by default set origin to empty array', () => {
        expect(Subset().origin).toEqual([]);
    });

    it('should by default set codes to empty array', () => {
        expect(Subset().codes).toEqual([]);
    });
});

describe('Subset prototype: defined properties on an initial subset', () => {
    it('should initiate a Subset as not published', () => {
        expect(Subset().isPublished).toBeFalsy();
    });

    it('should initiate a Subset with no previous version', () => {
        expect(Subset().previousVersion).toBeNull();
    });

    it('should initiate a Subset with no errors', () => {
        expect(Subset().errors).toBeUndefined();
    });

    it('should create a copy of a Subset with status DRAFT with no effect on the actual status', () => {
        const subset = Subset();
        expect(subset.draftPayload.administrativeStatus).toBe('DRAFT');
        expect(subset.administrativeStatus).toBe('INTERNAL');
    });

    it('should create a copy of a Subset with status OPEN with no effect on the actual status', () => {
        const subset = Subset();
        expect(subset.publishPayload.administrativeStatus).toBe('OPEN');
        expect(subset.administrativeStatus).toBe('INTERNAL');
    });
});

