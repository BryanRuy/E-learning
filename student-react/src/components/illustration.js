import React, { lazy } from 'react'
import { useSkin } from '@hooks/useSkin'
import PropTypes from 'prop-types';
import _ from 'lodash';

function Illustration(props) {

    const [skin, setSkin] = useSkin();
    const fileExt = `.${String(props.image).split('.').pop()}`;
    // const illustration = skin === 'dark' ? `${String(props.image).replace(fileExt, `-dark${fileExt}`)}` : `${String(props.image)}`;
    const illustration = props.image
    console.log(illustration);
    const source = require('@src/assets/images/' + illustration).default
    // const source = require('@src/assets/images/'+illustration).default
    const htmlProps = _.omit(props, ['image', 'useDarkVersion'])
    return (
        <img src={source} />
    )
}

Illustration.propTypes = {
    image: PropTypes.string.isRequired,
    useDarkVersion: PropTypes.bool
}


export default Illustration
