import React from 'react';
import { useLocation } from 'react-router-dom';


const WeatherPage = () => {
    const location = useLocation();
    const address = location.state?.address;

    return (
        <div>
            <h2>{address}</h2>
        </div>
    );
};

export default WeatherPage;
