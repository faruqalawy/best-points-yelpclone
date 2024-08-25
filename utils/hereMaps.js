const { type } = require('../schemas/placeSchema');
const ErrorHandler = require('./ErrorHandler')
const baseUrl = `https://geocode.search.hereapi.com/v1`
const apiKey = `niQ6TDiObOCq0SO5fcH5Woka9octu1YkOZJUrvcgAk4`

const geocode = async (address) => {
    const url = `${baseUrl}/geocode?q=${address}&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items[0]
    } catch (err) {
        new ErrorHandler(err.message, 500)
    }
}

const geometry = async (address) => {
    try {
        const { position } = await geocode(address)
        return {
            type: 'Point',
            coordinates: [position.lng, position.lat]
        }
    } catch (error) {
        new ErrorHandler(error.message, 500)
    }
}

module.exports = {
    geocode,
    geometry
}