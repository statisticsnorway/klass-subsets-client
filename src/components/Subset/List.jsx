import { SubsetBanner } from './Banner';

export const List = ({items}) => {
    return (
        <>{items?.length > 0 &&
        items.map((subset, i) => (
            <SubsetBanner key={i}
                          subsetData={subset} /> ))}
        </>
    );
};