import React from 'react';
import { Banner } from './Banner';

export const BannerList = ({ items }) => {
    return (
        <>{items?.length > 0 &&
        items.map((subset, i) => (
            <Banner key={ i } data={ subset } /> ))}
        </>
    );
};