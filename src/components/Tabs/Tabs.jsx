import React, {useState} from 'react';
import {Divider, Tabs as SsbTabs } from "@statisticsnorway/ssb-component-library";

export const Tabs = ({ dark, light, children }) => {
    const [ activeTab, changeTab ] = useState(children[0].props.path);
    const tabClicked = e => changeTab(e);

    return (
        <div>
            <SsbTabs
                activeOnInit={ children[0].props.path }
                items={ children.map(ch => ch.props) }
                onClick={ tabClicked } />
            { light && <Divider light /> }
            { dark && <Divider dark /> }
            {
                children.find(ch => ch.props.path === activeTab)
            }
        </div>
    );
}

export const Tab = ({ children }) => {
    return children;
};