import DOMPurify from 'dompurify';

export const replaceRefWithHTMLAndSanitize = note => {
    const replaceRefRegex = /<ref>/gi;
    const replaceSlashRefRegex = /<\/ref>/gi;
  
    const replaceRef = note.replace(replaceRefRegex, ' <strong>');
    const replaceSlashRef = replaceRef.replace(replaceSlashRefRegex, '</strong> ');

    return DOMPurify.sanitize(replaceSlashRef);
};

export const returnOffsetDate = date => {
    if (!date) return '';
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const offsetDate = new Date(date.getTime() - userTimezoneOffset);
  
    return offsetDate.toISOString().substr(0,10);
};