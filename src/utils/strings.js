import DOMPurify from 'dompurify';

export const replaceRef = note => {
    const replaceRefRegex = /<ref>/gi;
    const replaceSlashRefRegex = /<\/ref>/gi;
  
    const replaceRef = note.replace(replaceRefRegex, ' <strong>');
    const replaceSlashRef = replaceRef.replace(replaceSlashRefRegex, '</strong> ');

    return DOMPurify.sanitize(replaceSlashRef);
};

export const toId = text => {
    return text.toLowerCase()
        .replace(/å|æ/g, 'a')
        .replace(/ø/g, 'o')
        .replace(/[^a-z0-9-_ ]*/g, '');
};

export const sanitize = text => {
    return text.replace(/[^A-ZÆØÅa-zæøå0-9-.,; _]*/g, '');
};