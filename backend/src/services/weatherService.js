const axios = require('axios')

exports.getWeatherForClinic = async () => {
    try {
        const res = await axios.get('https://wttr.in/Almaty?format=j1', {
            timeout: 5000
        })
        const weather = res.data.current_condition[0]
        return {
            temp: weather.temp_C,
            feels_like: weather.FeelsLikeC,
            description: weather.weatherDesc[0].value,
            humidity: weather.humidity
        }
    } catch (e) {
        return { temp: 'N/A', description: 'Недоступно', error: true }
    }
}