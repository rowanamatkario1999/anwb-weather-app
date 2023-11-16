import React, { useState, useEffect } from 'react';
import {Badge, Button, Col, Form, Modal, Row, Table, InputGroup, Dropdown} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './index.css';
import logoImage from '../../assets/anwb-logo.png';
import { useNavigate } from 'react-router-dom';


interface Location {
    latitude: number;
    longitude: number;
}
const HomePage = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState('');
    const [address, setAddress] = useState('');
    const [locationPermission, setLocationPermission] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const handleWeatherClick = () => {
        navigate('/weather', { state: { address } });
    };

    const getCurrentLocation = () => {
        if (!locationPermission) return;

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
        } else {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const addr = await reverseGeocode(position.coords.latitude, position.coords.longitude);
                    setAddress(addr);
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                () => {
                    setError('Unable to retrieve your location.');
                }
            );
        }
    };


    const reverseGeocode = async (latitude: any, longitude: any) => {
        console.log(latitude);
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error("Error tijdens het ophalen van gegevens:", error);
            return null;
        }
    };

    const handleLocationPermission = () => {
        setLocationPermission(true);
        getCurrentLocation();
    };

    const fetchLocationSuggestions = async (inputValue: any) => {
        if (!inputValue) return [];

        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=nl&q=${inputValue}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };


    const handleSearchInput = async (e: any) => {
        const inputValue = e.target.value;
        const locations = await fetchLocationSuggestions(inputValue);
        setSuggestions(locations);
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleLocationSelect = (locationName: any) => {
        setAddress(locationName);
    };


    return (
        <div className="homepage-container">
            <div className="home-logo">
                <img src={logoImage} alt="Home Logo" width="250" height="250"/>
            </div>
            <div className="search-section">
                <Row>
                    <Col md={12}>
                        <Form>
                            <Form.Group controlId="formBasicSearch">
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Zoek op locatie"
                                        onChange={handleSearchInput}
                                    />
                                    <Dropdown>
                                        <Dropdown.Menu show={suggestions.length > 0}>
                                            {suggestions.length > 0 ? (
                                                suggestions.map((location: any, index: any) => (
                                                    <Dropdown.Item key={index} onClick={() => handleLocationSelect(location.display_name)}>
                                                        {location.display_name}
                                                    </Dropdown.Item>
                                                ))
                                            ) : (
                                                <Dropdown.Item disabled>Locatie niet gevonden</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                        {!location && <Button onClick={handleLocationPermission}>Gebruik mijn huidige locatie</Button>}

                        <div className="location-info">
                            <p>Locatie: {address}</p>
                            {address && <Button variant="primary" onClick={handleWeatherClick}>Zie weerbericht</Button>}
                        </div>


                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HomePage;
