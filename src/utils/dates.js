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

    // 'from' and 'validFrom' are not optional
    if (!from || !validFrom) {
        console.error("Either 'from' or 'validFrom' was not set. from: "+from+" validFrom: "+validFrom);
        return false;
    }

    if (!until && !validUntil) //until and validUntil are optional
        return true; //If neither date range has an end date, there is always overlap
    else if (until && !validUntil)
        return until > validFrom;
    else if (validUntil && !until)
        return validUntil > from;
    else //Both until and validUntil are set
        return (until > validFrom && from < validUntil) || (validUntil > from && validFrom < until);
}
