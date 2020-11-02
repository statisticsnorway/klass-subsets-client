import DOMPurify from 'dompurify';

export const replaceRef = note => {
    const replaceRefRegex = /<ref>/gi;
    const replaceSlashRefRegex = /<\/ref>/gi;
  
    const replaceRef = note?.replace(replaceRefRegex, ' <strong>');
    const replaceSlashRef = replaceRef?.replace(replaceSlashRefRegex, '</strong> ');

    return DOMPurify.sanitize(replaceSlashRef);
};

export const toId = text => {
    return text?.toLowerCase()
        .replace(/\s/g, '_')
        .replace(/å|æ/g, 'a')
        .replace(/ø/g, 'o')
        .replace(/[^a-z0-9-_]*/g, '');
};

// TODO: deview letter whitelist
export const sanitize = (text, maxLength) => {
    return text && text
        .substring(0, Math.min(maxLength, text.length))
        .replace(/[^A-ZÆØÅa-zæøå0-9-.,; _:!?()"'/%]*/g, '');
};

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
    if (!dateString || dateString?.length < 0) {
        return null;
    }
    return new Date(dateString)?.toLocaleString('ru-RU')?.substr(0, 17);
};

export const datePattern = /^((?:18|19|20|21|22)\d{2})-((?:0[1-9])|(?:1[0-2]))-((?:0[0-9])|(?:[1-2][0-9])|(?:3[0-1]))T\d{2}:\d{2}:\d{2}.\d{3}Z$/i //2020-09-21T00:00:00.000Z