import React from 'react'
import { useSkin } from '@hooks/useSkin'
const NotFound = (props) => {

    const [skin, setSkin] = useSkin();

    const illustration = skin === 'dark' ? 'not-found.png' : 'not-found.png',
        source = require(`@src/assets/images/illustrations/${illustration}`);

    return (
        <div className="text-center pt-2 pb-2">
            <h6>
                {
                    props.title
                }
            </h6>
            <img
                className="mt-25"
                src={source}
                style={{
                    width: props.width ? props.width : 200,
                    height: props.height ? props.height : 200
                }} />
            <div className="mt-25 text-muted">
                {
                    props.message
                }
            </div>
        </div>
    )
}

export default NotFound
