import DOMPurify from 'dompurify';

export const replaceRefWithHTMLAndSanitize = note => {
    const replaceRefRegex = /<ref>/gi;
    const replaceSlashRefRegex = /<\/ref>/gi;

    const replaceRef = note.replace(replaceRefRegex, ' <strong>');
    const replaceSlashRef = replaceRef.replace(replaceSlashRefRegex, '</strong> ');

    return DOMPurify.sanitize(replaceSlashRef);
};
export const parseDataForDropDowns = dataToParse => {
    const items = [];
    dataToParse.forEach((item, index) => {
        items.push({
            title: item.name,
            id: `${index}`,
            disabled: item.disabled
        });
    });
    return items;
};
