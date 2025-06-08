import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <Spinner
                animation="border"
                role="status"
                style={{
                    width: '50px',
                    height: '50px',
                    margin: 'auto',
                    display: 'block',
                }}
            >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default Loader;