import React, { useState } from 'react';
import { AvField } from 'availity-reactstrap-validation-safe';
import { Eye, EyeOff } from 'react-feather';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import './style.scss';

function PasswordToggle(props) {
    const [viewPassword, setViewPassword] = useState(false);

    const setToggle = () => {
        setViewPassword(viewPassword=>!viewPassword);
    }
    
    return (
        <div className="c-password-toggle">
            <Button 
                color="flat-secondary" 
                className="btn-icon btn-password"
                onClick={setToggle}>
            {viewPassword ?  <EyeOff size={16} />: <Eye size={16} />}
            </Button>

            <AvField
                name={props.name}
                type={viewPassword ? 'text': 'password'}
                placeholder={props.label}
                required
            />
        </div>
    )
}

PasswordToggle.propTypes = {
    label: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
}

export default PasswordToggle
