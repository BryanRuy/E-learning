import React from 'react'
import { useSkin } from '@hooks/useSkin'
function BrandLogo() {
    
    const [skin, setSkin] = useSkin();

    const illustration = skin === 'dark' ? 'logo-light.png' : 'logo.png',
        source = require(`@src/assets/images/logo/${illustration}`);

    return (
        <img src={source} style={{width: 30, height: 30}}/>
    )
}

export default BrandLogo
