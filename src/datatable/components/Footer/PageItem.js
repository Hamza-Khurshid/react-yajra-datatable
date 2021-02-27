import React from 'react';

const PageItem = ({ active, number, setPage }) => {
    const getClasses = () => ([
        'page',
        (active) ? 'active' : ''
    ].join(' '));

    const handleClick = () => setPage(number - 1);
    return (
        <div className={getClasses()} onClick={handleClick} style={{ margin: '0px 8px', cursor: 'pointer' }}>
            {number}
        </div>
    );
};

export default PageItem;
