import React from 'react';
import '../../css/pages.css';
import { Input } from '@statisticsnorway/ssb-component-library';

export default function SearchSubsetsPage() {
    return (
        <div className='page'>
            <h3>Search subsets</h3>
            {/*TODO: asap*/}
            <Input
                ariaLabel="Input field Search"
                placeholder="Search text"
                searchField
            />
            <h3>Search results</h3>
        </div>
    );
};