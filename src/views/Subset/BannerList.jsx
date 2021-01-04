import React from 'react';
import { Banner } from 'views';

export const BannerList = ({ items }) => {
    return (
        <>{ items?.map(subset => (
            <Banner key={ subset.id } data={ subset } /> ))}
        </>
    );
};