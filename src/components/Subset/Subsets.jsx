import { SubsetBanner } from './SubsetsBanner';

export const Subsets = ({items}) => {
    return (
        <>{items?.length > 0 &&
        items.map((subset, i) => (
            <SubsetBanner key={i}
                          subsetData={subset} /> ))}
        </>
    );
};