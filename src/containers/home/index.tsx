import React, { useState, useEffect } from 'react';
import {
    Badge,
    Button,
    Col,
    Form,
    Modal,
    Row,
    Table,
    InputGroup,
    Dropdown,
    Container,
    Navbar,
    Nav, FormControl
} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faSearch} from '@fortawesome/free-solid-svg-icons';
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
                    // @ts-ignore
                    const addrString = addr.toString();
                    setAddress(addrString);
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
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            // Zoek naar stad in verschillende eigenschappen van de adresinformatie
            let city = 'Onbekend'; // Standaardwaarde
            if (data.address.city) {
                city = data.address.city;
            } else if (data.address.town) {
                city = data.address.town;
            } else if (data.address.village) {
                city = data.address.village;
;            }

            return city;

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
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            src={logoImage} // Vervang dit door je afbeeldingspad
                            width="auto" // Dit kun je instellen om de grootte van je logo te regelen
                            height="50" // Pas de hoogte aan indien nodig
                            className="d-inline-block align-top" // Bootstrap-klassen voor uitlijning
                            alt="ANWB Logo" // Alt-tekst voor het logo
                            style={{ backgroundColor: 'transparent' }} // Maakt de achtergrond van de img-tag transparant
                        />

                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Buienradar</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <div className="homepage-container">
                    <div className="search-section">
                        <Row>
                            <Col md={12}>
                                <h1 style={{ fontFamily: "'Roboto', sans-serif" }}>Ben jij ook zo benieuwd naar het weer?</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Form>
                                    <Form.Group controlId="formBasicSearch">
                                        <InputGroup>
                                            <FormControl
                                                placeholder="Ik ben op zoek naar..."
                                                aria-label="Search"
                                                onChange={handleSearchInput}
                                            />
                                            {address && <Button variant="outline-secondary" onClick={handleWeatherClick}>
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </Button>}
                                        </InputGroup>
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
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={4}>
                                {!location && !address && (
                                    <Button variant='light' onClick={handleLocationPermission}>Gebruik mijn huidige locatie</Button>
                                )}
                            </Col>

                            <div className="location-info">
                                {address ? <p className="fade-in-up">{address}</p> : null}
                            </div>
                        </Row>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default HomePage;
