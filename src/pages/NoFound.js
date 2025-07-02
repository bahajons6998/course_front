import React from 'react';
import { Link } from 'react-router-dom';

function NoFound() {
    return (
        <div className="container">
            <div>
                <h1 className="text-center"><code>Not Found page!</code></h1>
                <p className='text-center py-3'> Wrog adress.
                    Please check your URL. Or go Home page.<br />
                    <Link to={'/'}>Home</Link>
                </p>
            </div>
        </div>
    );
}
export default NoFound;