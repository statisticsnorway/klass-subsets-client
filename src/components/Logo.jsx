import React from 'react';
import SsbLogo from "../images/SsbLogo.svg";
import SsbLogoS from "../images/SsbLogoS.svg";

export function Logo() {
    return <a href='https://www.ssb.no'>
        <img src={SsbLogo}
             id='logo-full'
             alt='SSB-logo'
        />
        <img src={SsbLogoS}
             id='logo-symbol'
             alt='SSB-logo'
        />
    </a>;
}