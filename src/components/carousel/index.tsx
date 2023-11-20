// CustomCarousel.js
import React from 'react';
import { Carousel } from 'react-bootstrap';
import './CustomCarousel.css'; // Make sure the CSS file is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoad } from '@fortawesome/free-solid-svg-icons';

const carouselItems = [
    {
        id: 1,
        title: "Verkeerssituatie",
        content: "Er zijn nu 7 meldingen met een totale lengte van 0 km",
        className: "blue-bg",
        icon: faRoad
    },
    {
        id: 2,
        title: "Verkeersverwachting",
        content: "Tijdens het weekend kans op regen in het hele land en vertraging door Storm.",
        className: "grey-bg"
    },
    {
        id: 3,
        title: "Pech melden",
        content: "Direct pech melden, volg je wegenwacht live.",
        className: "blue-bg"
    },
    {
        id: 4,
        title: "Verkeersverwachting",
        content: "Plan jouw route met actuele verkeersinformatie binnen Nederland.",
        className: "grey-bg"
    },
];

const CustomCarousel = () => {
    return (
        <Carousel indicators={false} nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />} prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}>
            {carouselItems.map(item => (
                <Carousel.Item key={item.id} className={item.className}>
                    <div className="carousel-content">
                        <div className="carousel-text">
                            <h3>{item.title}</h3>
                            <p>{item.content}</p>
                            {item.icon && <FontAwesomeIcon icon={item.icon} />}
                        </div>
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default CustomCarousel;
