import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {Button} from "react-bootstrap";


const WeatherPage = () => {
    const location = useLocation();
    const address = location.state?.address;
    const [data, setData] = useState(null);
    const [tempMin, setTempMin] = useState('');

    const openWeatherApi = async (city: string) => {
        const apiKey = '0b45600bea02aa2ea48c0d6b3841e7d2'; // Vervang dit met je eigen API-sleutel
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Error tijdens het ophalen van gegevens:", error);
        }
    };

    useEffect(() => {
        if (address) {
            openWeatherApi(address).then(r => setData(r));
        }
    }, [address]);

    const kelvinToCelsius = (kelvin: any) => {
        return (kelvin - 273.15).toFixed(2); // Afgerond op 2 decimalen
    };

    const getSpecifikData = (data: any) => {
        if (data && data.main && data.main.feels_like) {
            const celsius = kelvinToCelsius(data.main.feels_like);
            return `${celsius} °C`;
        } else {
            return 'Niet beschikbaar';
        }
    };


    return (
        <div>
            <h2>{address}</h2>
            {data && (
                <div>
                    <h4>Gevoelstemperatuur: {getSpecifikData(data)}</h4>
                </div>
            )}
        </div>
    );
};

export default WeatherPage;
