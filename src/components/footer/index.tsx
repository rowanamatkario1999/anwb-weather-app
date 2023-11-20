// Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './index.css';

const Footer = () => {
    return (
        <footer className="footer" style={{backgroundColor: '#003D86',}}>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={4}>
                        <h5>Service & Contact</h5>
                        <p>Contact met ANWB</p>
                        <p>ANWB Alarmcentrale</p>
                        <p>ANWB Experts</p>
                        <p>ANWB Verzekeringen</p>
                        <p>ANWB Winkels</p>
                        <p>Pechhulp</p>
                    </Col>
                    <Col md={4}>
                        <h5>Vereniging en bedrijf</h5>
                        <p>Belangenbehartiging</p>
                        <p>ANWB Medical Air Assistance</p>
                        <p>Maatschappelijke projecten</p>
                        <p>Voor de pers</p>
                        <p>Werken bij de ANWB</p>
                        <p>Pechhulp</p>
                    </Col>
                    <Col md={4}>
                        <h5>Volg ons</h5>
                        <p>Nieuwbrief</p>
                        <p>ANWB Apps</p>
                        <p>ANWB Podcast</p>
                        <p>Facebook</p>
                        <p>Instagram</p>
                        <p>Twitter</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
