import React, {useState, useEffect, Fragment} from 'react';
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
    Nav, FormControl, Card
} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faSearch} from '@fortawesome/free-solid-svg-icons';
import './index.css';
import logoImage from '../../assets/anwb-logo.png';
import cloudy from '../../assets/cloudy1.jpeg';
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/footer";
import CustomCarousel from "../../components/carousel";


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
    const [data, setData] = useState([]);
    const [weather, setWeather] = useState([]);
    const [temp, setTemp] = useState([]);
    const [wind, setWind] = useState([]);
    const [sys, setSys] = useState([]);
    const navigate = useNavigate();

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
            openWeatherApi(address)
                .then((r) => {
                    console.log(r);
                    setData(r);
                    setWeather(r.weather);
                    setTemp(r.main);
                    setWind(r.wind);
                    setSys(r.sys);
                });
        }

    }, [address]);


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

    const getImageSrc = (type: any) => {
        switch (type) {
            case 'Clouds':
                return {cloudy};
            case 'sun':
                return 'sun.png';
            case 'moon':
                return 'moon.png';
            default:
                return 'default.png';
        }
    };

    const imageSrc = getImageSrc((weather as any)[0]?.main);

    const kelvinToCelsius = (kelvin: any) => {
        return parseFloat((kelvin - 273.15).toFixed(0));
    };

    const getFormattedDate = () => {
        const now = new Date();
        return new Intl.DateTimeFormat('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(now);
    };

    const todaysDate = getFormattedDate();

    const convertUnixTime = (unixTime: any) => {
        const date = new Date(unixTime * 1000); // Converteert de Unix-tijd naar milliseconden
        return date.toLocaleString("nl-NL", { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const sunriseTime = convertUnixTime((sys as any).sunrise);
    const sunsetTime = convertUnixTime((sys as any).sunset);

    const convertSpeedToKmh = (speedInMps: any) => {
        return speedInMps * 3.6;
    }

    const convertDegreesToDirection = (degrees: any) => {
        const directions = ['Noord', 'Noordnoordoost', 'Noordoost', 'Oostnoordoost', 'Oost', 'Oostzuidoost', 'Zuidoost', 'Zuidzuidoost', 'Zuid', 'Zuidzuidwest', 'Zuidwest', 'Westzuidwest', 'West', 'Westnoordwest', 'Noordwest', 'Noordnoordwest'];
        const index = Math.round((degrees % 360) / 22.5);
        return directions[index] || 'Noord';
    }

    const speedKmh = convertSpeedToKmh((wind as any).speed); // Omzetten naar km/u
    const windDirection = convertDegreesToDirection((wind as any).deg); // Omzetten naar kompasrichting

    return (
        <>
            <Navbar bg="light" expand="lg" style={{marginBottom: '5%'}}>
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            src={logoImage}
                            width="100"
                            height="auto"
                            className="d-inline-block align-top"
                            alt="ANWB Logo"
                            style={{ backgroundColor: 'transparent', zIndex: '10' }}
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
                                <h1 style={{ fontFamily: "Montserrat, sans-serif" }}>Ben jij ook zo benieuwd naar het weer?</h1>
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
                                    <Button variant='light' onClick={handleLocationPermission} style={{ fontFamily: "Montserrat, sans-serif", borderRadius: '50px', backgroundColor: 'lightgrey'}}>Gebruik mijn huidige locatie</Button>
                                )}
                            </Col>

                            <div className="location-info" style={{marginTop: '3%'}}>
                                {address ?
                                    <Fragment>
                                        <h3 style={{ fontFamily: "Montserrat, sans-serif" }}>ANWB Buienradar</h3>
                                        <Card className="fade-in-up" style={{marginTop: '15px', marginBottom: '25px'}}>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12} style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>
                                                        <p style={{ fontFamily: "Montserrat, sans-serif", float:'right'}}>{address}</p>
                                                        <p style={{ fontFamily: "Montserrat, sans-serif"}}>Vandaag: {todaysDate}</p>
                                                    </Col>
                                                </Row>
                                                <Row style={{marginTop: '10px'}}>
                                                    <Col md={3} className="d-flex align-items-center justify-content-center" style={{ marginLeft: '5px' }}>
                                                        <img
                                                            src={cloudy}
                                                            width="200"
                                                            height="auto"
                                                            className="d-inline-block align-top"
                                                            alt="ANWB Logo"
                                                            style={{ backgroundColor: 'transparent', zIndex: '10' }}
                                                        />
                                                    </Col>
                                                    <Col md={3} className="d-flex align-items-center justify-content-center">
                                                        <h1>{kelvinToCelsius((temp as any).temp)}°C</h1>
                                                    </Col>
                                                    <Col md={5}>
                                                        <Table bordered={false} className="weather-table">
                                                            <tbody>
                                                            <tr>
                                                                <td>Gevoels temperatuur:</td>
                                                                <td>{kelvinToCelsius((temp as any).feels_like)}°C</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Minimale temperatuur:</td>
                                                                <td>{kelvinToCelsius((temp as any).temp_min)}°C</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Maximale temperatuur:</td>
                                                                <td>{kelvinToCelsius((temp as any).temp_max)}°C</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Windsnelheid:</td>
                                                                <td>{speedKmh.toFixed(2)} km/h</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Windrichting:</td>
                                                                <td>{windDirection}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Zonsopgang:</td>
                                                                <td>{sunriseTime}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Zonsondergang:</td>
                                                                <td>{sunsetTime}</td>
                                                            </tr>
                                                            </tbody>
                                                        </Table>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Fragment> : null}
                            </div>
                        </Row>
                        <CustomCarousel />
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default HomePage;
