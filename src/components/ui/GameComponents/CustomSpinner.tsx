import React from 'react';
// @ts-ignore
import earth from '../../views/gif/Earth2.1.gif';

const CustomSpinner = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <img
                src={earth}
                alt="earth-gif"
                style={{ width: '50px' }}
            />
            <p style={{ marginTop: '10px' }}>Loading...</p>
        </div>
    );
};

export default CustomSpinner;
