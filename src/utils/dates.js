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


export const doPeriodsIntersect = (
    from = null,
    until = null,
    validFrom = null,
    validUntil = null
) => {

    // console.debug({ from, until, validFrom, validUntil})

    //prerequisites not tested here:
    // if until is set: from < until
    // if validUntil is set: valdiFrom < validUntil
    return(
      from && validFrom // both from and validFrom must be set
      && from <= validFrom // and from must be before or equal to validFrom
      && (!until || // and  - either is until not set (infinite)
        (!validUntil && until > validFrom) || // or validUntil is not set and until must be after validFrom
        (validUntil && until >= validUntil))  // or validUntil is set and until is after or equal to validUntil
    )
}
