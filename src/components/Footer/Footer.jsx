import React from 'react';
import {
    GitHub,
    Facebook,
    Linkedin,
    Rss,
    Twitter
} from 'react-feather';
import SsbLogo from '../../images/SsbLogo.svg';
import { Link, Button, Footer as SsbFooter} from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';


export const Footer = () => {
    const { t } = useTranslation();

    return (
        <SsbFooter>
                <div className='bottom-row flex-row justify-space-between flex-wrap' style={{margin: '0px'}}>
                    <img src={ SsbLogo } style={{ filter: 'invert(100%)' }} alt='ssb-logo' />
                    <Button negative
                            onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
                    > { t('To Top') }
                    </Button>
                    <div className="global-links">
                        <Link href='https://www.ssb.no/' isExternal negative>Statistisk sentralbyrå © 2020</Link>
                        <Link href='https://www.ssb.no/a-aa' isExternal negative>A-Å</Link>
                        <Link href='https://www.ssb.no/nettstedskart' isExternal negative>{t('Site map')}</Link>

                        <Link href='https://github.com/statisticsnorway/klass-subsets-client' isExternal negative icon={<GitHub size={24} />} />
                        <Link href='https://www.facebook.com/statistisksentralbyra/' isExternal negative icon={<Facebook size={24} />} />
                        <Link href='https://twitter.com/ssbnytt' isExternal negative icon={<Twitter size={24} />} />
                        <Link href='https://www.linkedin.com/company/statistics-norway/' isExternal negative icon={<Linkedin size={24} />} />
                        <Link href='https://www.ssb.no/informasjon/rss' isExternal negative icon={<Rss size={24} />} />
                    </div>
                </div>
        </SsbFooter>
    );
}
