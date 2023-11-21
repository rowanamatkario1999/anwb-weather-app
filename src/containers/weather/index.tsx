import React, {Fragment, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {Col, Row} from "react-bootstrap";


const WeatherPage = () => {
    const location = useLocation();
    const address = location.state?.address;
    const [data, setData] = useState(null);
    const [temp, setTemp] = useState([]);

    const openWeatherApi = async (city: string) => {
        const apiKey = '0b45600bea02aa2ea48c0d6b3841e7d2';
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
        return (kelvin - 273.15).toFixed(2);
    };

    const getTemp = (data: any) => {
        // if (data && data.main && data.main.feels_like) {
        //     const feelsLike = set;
        //     const feelsLike = kelvinToCelsius(data.main.feels_like);
        //     return `${feelsLike} °C`;
        // } else {
        //     return 'Niet beschikbaar';
        // }
    };


    return (
        <Fragment>
            <div className="weather-widget">
                <h2>{address} | <span>Nederland</span> </h2>
                {data && (
                    <Row>
                        <Col md={4}>
                            Gevoelstemperatuur
                        </Col>
                        <Col md={8}>
                            <h4>45:</h4>
                        </Col>
                    </Row>
                    )}
            </div>
        </Fragment>
    );
};

export default WeatherPage;
