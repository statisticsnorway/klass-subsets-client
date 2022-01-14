import { codesControl } from './codesControl';
import { Subset } from './Subset.prototype';
import { describe, beforeAll, it, expect } from '@jest/globals';

describe('Add new codes, add and remove timestamps', () => {

    let given = {};

    beforeAll(() => {
        given = Subset({
            versions: [{
                codes:
                    [
                        {
                            "id": "131:3002:Moss",
                            "code": "3002",
                            "parentCode": null,
                            "level": "1",
                            "name": "Moss",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 1
                        },
                        {
                            "id": "131:3003:Sarpsborg",
                            "code": "3003",
                            "parentCode": null,
                            "level": "1",
                            "name": "Sarpsborg",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 2
                        },
                        {
                            "id": "131:3004:Fredrikstad",
                            "code": "3004",
                            "parentCode": null,
                            "level": "1",
                            "name": "Fredrikstad",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 3
                        },
                        {
                            "id": "131:3005:Drammen",
                            "code": "3005",
                            "parentCode": null,
                            "level": "1",
                            "name": "Drammen",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 4
                        },
                        {
                            "id": "131:3006:Kongsberg",
                            "code": "3006",
                            "parentCode": null,
                            "level": "1",
                            "name": "Kongsberg",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 5
                        }
                    ]
            }]

        });
    });

    it('Prepend codes', () => {

        expect(given.versions[0].codes.length).toEqual(5);
        expect(given.versions[0].codes[0].name).toEqual('Moss');
        expect(given.versions[0].codes[0].id).toEqual('131:3002:Moss');
        expect(given.versions[0].codes[0].rank).toEqual(1);
        expect(given.versions[0].codes[0].timestamp).toBeFalsy();

        codesControl(given).prependCodes([{
            "code": "3001",
            "parentCode": null,
            "level": "1",
            "name": "Halden",
            "shortName": "",
            "presentationName": "",
            "classificationId": "131",
            "rank": 1
        }]);

        expect(given.versions[0].codes.length).toEqual(6);
        expect(given.versions[0].codes[0].name).toEqual('Halden');
        expect(given.versions[0].codes[0].id).toEqual('131:3001:Halden');
        expect(given.versions[0].codes[0].rank).toEqual(1); // rerankCodes() is called in Subset.prototype
        expect(given.versions[0].codes[0].timestamp).toBeTruthy();

    });

    it('Remove timestamps from codes', () => {

        expect(given.versions[0].codes[0].timestamp).toBeTruthy();
        expect(given.versions[0].codes[1].timestamp).toBeFalsy();

        codesControl(given).removeTimestamps();

        expect(given.versions[0].codes[0].timestamp).toBeFalsy();
        expect(given.versions[0].codes[1].timestamp).toBeFalsy();

    });
});

describe('Remove codes', () => {

    let given = {};

    beforeAll(() => {
        given = Subset({
            versions: [{
                codes:
                    [
                        {
                            "id": "104:30:Viken",
                            "code": "30",
                            "parentCode": null,
                            "level": "1",
                            "name": "Viken",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "104",
                            "rank": 1
                        },
                        {
                            "id": "131:3002:Moss",
                            "code": "3002",
                            "parentCode": null,
                            "level": "1",
                            "name": "Moss",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 2
                        },
                        {
                            "id": "131:3003:Sarpsborg",
                            "code": "3003",
                            "parentCode": null,
                            "level": "1",
                            "name": "Sarpsborg",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 3
                        },
                        {
                            "id": "131:3004:Fredrikstad",
                            "code": "3004",
                            "parentCode": null,
                            "level": "1",
                            "name": "Fredrikstad",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 4
                        },
                        {
                            "id": "131:3005:Drammen",
                            "code": "3005",
                            "parentCode": null,
                            "level": "1",
                            "name": "Drammen",
                            "shortName": "",
                            "presentationName": "",
                            "classificationId": "131",
                            "rank": 5
                        }
                    ]
            }]

        });
    });

    it('Remove second and last code', () => {

        codesControl(given).removeCodes([
            {
                "id": "131:3002:Moss",
                "code": "3002",
                "parentCode": null,
                "level": "1",
                "name": "Moss",
                "shortName": "",
                "presentationName": "",
                "classificationId": "131",
                "rank": 2
            },
            {
                "id": "131:3005:Drammen",
                "code": "3005",
                "parentCode": null,
                "level": "1",
                "name": "Drammen",
                "shortName": "",
                "presentationName": "",
                "classificationId": "131",
                "rank": 5
            }
        ]);

        expect(given.versions[0].codes.length).toEqual(3);
        expect(given.versions[0].codes[1].name).toEqual('Sarpsborg');
        expect(given.versions[0].codes[1].id).toEqual('131:3003:Sarpsborg');
        expect(given.versions[0].codes[1].rank).toEqual(2);
        expect(given.versions[0].codes[2].name).toEqual('Fredrikstad');
        expect(given.versions[0].codes[2].id).toEqual('131:3004:Fredrikstad');
        expect(given.versions[0].codes[2].rank).toEqual(3);

    });

    it('Try to remove all municipalities on a published version', () => {

        given.isEditableCodes = function () { return false; };

        codesControl(given).removeCodesWithClassificationId('131');

        expect(given.versions[0].codes.length).toEqual(3);
        expect(given.versions[0].codes[0].name).toEqual('Viken');
        expect(given.versions[0].codes[0].id).toEqual('104:30:Viken');
        expect(given.versions[0].codes[0].rank).toEqual(1);

    });

    it('Remove all municipalities', () => {

        given.isEditableCodes = function () { return true; };

        codesControl(given).removeCodesWithClassificationId('131');

        expect(given.versions[0].codes.length).toEqual(1);
        expect(given.versions[0].codes[0].name).toEqual('Viken');
        expect(given.versions[0].codes[0].id).toEqual('104:30:Viken');
        expect(given.versions[0].codes[0].rank).toEqual(1);

    });

});

describe('Test moving one code from bottom to top', () => {

    let given = {};

    beforeAll(() => {
        given = {
            codes:
                [
                    {
                        "id": "131:3001:Halden",
                        "code": "3001",
                        "parentCode": null,
                        "level": "1",
                        "name": "Halden",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 1
                    },
                    {
                        "id": "131:3002:Moss",
                        "code": "3002",
                        "parentCode": null,
                        "level": "1",
                        "name": "Moss",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 2
                    },
                    {
                        "id": "131:3003:Sarpsborg",
                        "code": "3003",
                        "parentCode": null,
                        "level": "1",
                        "name": "Sarpsborg",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 3
                    },
                    {
                        "id": "131:3004:Fredrikstad",
                        "code": "3004",
                        "parentCode": null,
                        "level": "1",
                        "name": "Fredrikstad",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 4
                    },
                    {
                        "id": "131:3005:Drammen",
                        "code": "3005",
                        "parentCode": null,
                        "level": "1",
                        "name": "Drammen",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 5
                    },
                    {
                        "id": "131:3006:Kongsberg",
                        "code": "3006",
                        "parentCode": null,
                        "level": "1",
                        "name": "Kongsberg",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 6
                    }
                ]
        };
        given.isEditableCodes = function () { return true; };
    });

    it('Change rank for last code from 6 to 1', () => {

        expect(given.codes.length).toEqual(6);
        expect(given.codes[0].name).toEqual('Halden');
        expect(given.codes[0].rank).toEqual(1);
        expect(given.codes[5].name).toEqual('Kongsberg');
        expect(given.codes[5].rank).toEqual(6);

        codesControl(given).changeRank(1, [{
            "id": "131:3006:Kongsberg",
            "code": "3006",
            "parentCode": null,
            "level": "1",
            "name": "Kongsberg",
            "shortName": "",
            "presentationName": "",
            "classificationId": "131",
            "rank": 6
        }]);

        expect(given.codes[0].name).toEqual('Halden');
        expect(given.codes[0].rank).toEqual(1);
        expect(given.codes[5].name).toEqual('Kongsberg');
        expect(given.codes[5].rank).toEqual(0);

    });

    it('Re-order codes according to rank', () => {

        codesControl(given).reorderCodes();

        expect(given.codes[0].name).toEqual('Kongsberg');
        expect(given.codes[0].rank).toEqual(0);
        expect(given.codes[5].name).toEqual('Drammen');
        expect(given.codes[5].rank).toEqual(5);

    });

    it('Re-rank codes according to order', () => {

        codesControl(given).rerankCodes();

        expect(given.codes[0].name).toEqual('Kongsberg');
        expect(given.codes[0].rank).toEqual(1);
        expect(given.codes[5].name).toEqual('Drammen');
        expect(given.codes[5].rank).toEqual(6);

    });

});

describe('Test moving two codes from top to bottom', () => {

    let given = {};

    beforeAll(() => {
        given = {
            codes:
                [
                    {
                        "id": "131:3001:Halden",
                        "code": "3001",
                        "parentCode": null,
                        "level": "1",
                        "name": "Halden",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 1
                    },
                    {
                        "id": "131:3002:Moss",
                        "code": "3002",
                        "parentCode": null,
                        "level": "1",
                        "name": "Moss",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 2
                    },
                    {
                        "id": "131:3003:Sarpsborg",
                        "code": "3003",
                        "parentCode": null,
                        "level": "1",
                        "name": "Sarpsborg",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 3
                    },
                    {
                        "id": "131:3004:Fredrikstad",
                        "code": "3004",
                        "parentCode": null,
                        "level": "1",
                        "name": "Fredrikstad",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 4
                    },
                    {
                        "id": "131:3005:Drammen",
                        "code": "3005",
                        "parentCode": null,
                        "level": "1",
                        "name": "Drammen",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 5
                    },
                    {
                        "id": "131:3006:Kongsberg",
                        "code": "3006",
                        "parentCode": null,
                        "level": "1",
                        "name": "Kongsberg",
                        "shortName": "",
                        "presentationName": "",
                        "classificationId": "131",
                        "rank": 6
                    }
                ]
        };
        given.isEditableCodes = function () { return true; };
    });

    it('Change rank for the two last codes from 6 to 1', () => {

        expect(given.codes.length).toEqual(6);
        expect(given.codes[0].name).toEqual('Halden');
        expect(given.codes[0].rank).toEqual(1);
        expect(given.codes[1].name).toEqual('Moss');
        expect(given.codes[1].rank).toEqual(2);
        expect(given.codes[5].name).toEqual('Kongsberg');
        expect(given.codes[5].rank).toEqual(6);

        codesControl(given).changeRank(6, [
            {
                "id": "131:3001:Halden",
                "code": "3001",
                "parentCode": null,
                "level": "1",
                "name": "Halden",
                "shortName": "",
                "presentationName": "",
                "classificationId": "131",
                "rank": 1
            },
            {
                "id": "131:3002:Moss",
                "code": "3002",
                "parentCode": null,
                "level": "1",
                "name": "Moss",
                "shortName": "",
                "presentationName": "",
                "classificationId": "131",
                "rank": 2
            }
        ]);

        expect(given.codes.length).toEqual(6);
        expect(given.codes[0].name).toEqual('Halden');
        expect(given.codes[0].rank).toEqual(7);
        expect(given.codes[1].name).toEqual('Moss');
        expect(given.codes[1].rank).toEqual(7);
        expect(given.codes[5].name).toEqual('Kongsberg');
        expect(given.codes[5].rank).toEqual(6);

    });

    it('Re-order codes according to rank', () => {

        codesControl(given).reorderCodes();

        expect(given.codes.length).toEqual(6);
        expect(given.codes[0].name).toEqual('Sarpsborg');
        expect(given.codes[0].rank).toEqual(3);
        expect(given.codes[1].name).toEqual('Fredrikstad');
        expect(given.codes[1].rank).toEqual(4);
        expect(given.codes[4].name).toEqual('Halden');
        expect(given.codes[4].rank).toEqual(7);
        expect(given.codes[5].name).toEqual('Moss');
        expect(given.codes[5].rank).toEqual(7);

    });

    it('Re-rank codes according to order', () => {

        codesControl(given).rerankCodes();

        expect(given.codes.length).toEqual(6);
        expect(given.codes[0].name).toEqual('Sarpsborg');
        expect(given.codes[0].rank).toEqual(1);
        expect(given.codes[1].name).toEqual('Fredrikstad');
        expect(given.codes[1].rank).toEqual(2);
        expect(given.codes[4].name).toEqual('Halden');
        expect(given.codes[4].rank).toEqual(5);
        expect(given.codes[5].name).toEqual('Moss');
        expect(given.codes[5].rank).toEqual(6);

    });

});
