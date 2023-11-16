import React from 'react'
import { useSkin } from '@hooks/useSkin'
function NoNetwork(props) {

    const [skin, setSkin] = useSkin();

    const illustration = skin === 'dark' ? 'no-network.png' : 'no-network.png',
        source = require(`@src/assets/images/illustrations/${illustration}`);

    return (
        <div className="text-center pt-2">
            <h6>
                {
                    props.title
                }
            </h6>
            <img src={source}
                className="mt-25"
                style={{
                    width: props.width ? props.width : 200,
                    height: props.height ? props.height : 200
                }}
            />
            <div className="mt-25 text-muted">
                {
                    props.message
                }
            </div>
        </div>

    )
}

export default NoNetwork
