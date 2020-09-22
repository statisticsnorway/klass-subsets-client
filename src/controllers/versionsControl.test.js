import { Subset } from './Subset.prototype';

describe('Subset versionsControl: calculateVersionValidUntil', () => {
    it('should return null for empty subset', () => {
        const given = Subset({});
        expect(given.calculateVersionValidUntil()).toBeNull();
    });

    it('should return subset.validUntil if no previous versions available', () => {
        const given = Subset({
            validUntil: '2020-09-21T00:00:00.000Z'
        });
        expect(given.calculateVersionValidUntil()).toBe('2020-09-21T00:00:00.000Z');
    });

    it('should return subset.validUntil if no previous versions available', () => {
        const given = Subset({
            validUntil: '<script>alert(true)</script>'
        });
        expect(given.calculateVersionValidUntil()).toBeNull();
    });
});