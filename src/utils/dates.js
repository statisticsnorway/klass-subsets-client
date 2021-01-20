export const today = () => {
    return new Date().toJSON().substr(0, 10);
};

export const eu = (dateString) => {
    if (!dateString || dateString?.length < 0) {
        return null;
    }
    return euTime(dateString).substr(0, 10);
};

export const euTime = (dateString) => {
    //console.debug('euTime', {dateString}, {result: new Date(dateString)?.toLocaleString('ru-RU')?.substr(0, 17)});

    if (!dateString || dateString?.length < 0) {
        return null;
    }
    return new Date(dateString)?.toLocaleString('ru-RU')?.substr(0, 17);
};

export const datePattern = /^((?:18|19|20|21|22)\d{2})-((?:0[1-9])|(?:1[0-2]))-((?:0[0-9])|(?:[1-2][0-9])|(?:3[0-1]))T\d{2}:\d{2}:\d{2}.\d{3}Z$/i //2020-09-21T00:00:00.000Z

// TODO: input validation (test date pattern)
// TESTME
export const isInPeriodInclEnd = (date = null, start = null, end = null) => {
    if (!date || !start) {
        return false;
    }
    // console.debug('isInPeriodInclEnd', !end ? date >= start : date >= start && date <= end);
    console.debug('isInPeriodInclEnd', date, !end ? date >= start : date >= start && date <= end);

    return !end
        ? date >= start
        : date >= start && date <= end;
};

// TODO: input validation (test date pattern)
// TESTME
export const isInPeriodExclEnd = (date = null, start = null, end = null) => {
    if (!date || !start) {
        return false;
    }
    console.debug('isInPeriodExclEnd', date, !end ? date >= start : date >= start && date < end);

    return !end
        ? date >= start
        : date >= start && date < end;
};

// TODO: input validation (test date pattern)
// TESTME
export const isInPeriodExclStart = (date = null, start = null, end = null) => {
    if (!date || !start) {
        return false;
    }
    console.debug('isInPeriodExclStart', date, !end ? date > start : date > start && date <= end);

    return !end
        ? date > start
        : date > start && date <= end;
};

export const doPeriodsIntersect = (
    from = null,
    until = null,
    validFrom = null,
    validUntil = null
) => {

    console.debug({ from, until, validFrom, validUntil})

    return isInPeriodExclEnd(from, validFrom, validUntil )
    || isInPeriodInclEnd(until, validFrom, validUntil )
    || isInPeriodExclEnd( validFrom, from, until )
    || isInPeriodExclStart( validUntil, from, until )
};