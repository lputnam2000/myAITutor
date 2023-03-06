import React from 'react';

function WebsiteViewer({url}) {
    return (
        <iframe src={url}/>
    );
}

export default WebsiteViewer;