const openWeatherApi = async (city: string) => {
    //Normaliter zet ik mijn apiKey in mijn .env map
    const apiKey = '0b45600bea02aa2ea48c0d6b3841e7d2';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Fout bij het ophalen van weergegevens:', error);
        return null;
    }
};

const actions = {
    openWeatherApi,
};

export { actions };
