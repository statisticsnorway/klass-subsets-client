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

export const sanitize = (text, maxLength) => {
    return text && text
        .substring(0, Math.min(maxLength, text.length))
        .replace(/[^A-ZÆØÅa-zæøå0-9-.,; _]*/g, '');
};

export const today = () => {
    return new Date().toISOString().substr(0, 10);
};

export const eu = (dateString) => {
    if (!dateString || dateString?.length < 0) {
        return null;
    }
    const date = new Date(dateString);
    return `${date?.getDate()}.${date?.getMonth()}.${date?.getFullYear()}`
}