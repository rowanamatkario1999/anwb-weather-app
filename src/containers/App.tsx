import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherPage from './weather/index';
import HomePage from './home/index';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/weather" element={<WeatherPage />} />
            </Routes>
        </Router>
    );
};

export default App;
