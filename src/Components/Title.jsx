import React from 'react';

const TitleBar = ({ title }) => {
    const style = {
        backgroundColor: 'green',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        fontSize: '24px',
    };

    return <div style={style}>{title}</div>;
};

export default TitleBar;
