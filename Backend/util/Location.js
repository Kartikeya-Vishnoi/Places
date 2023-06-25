const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "f66f50a110b044239f35c9c49912e5d0";

async function getCoordsForAddress(address) {
  // console.log(`http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${encodeURIComponent(
  // address
  // )}`)
  const response = await axios.get(
    `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${encodeURIComponent(
      address
    )}`
  );
  //api_using:- https://positionstack.com/dashboard
  const data = response.data.data[0];
  console.log(data);
  console.log(    `http://api.positionstack.com/v1/forward?access_key=${API_KEY}&query=${encodeURIComponent(
    address
  )}`)
  const coordinates = {
    lat: data.latitude,
    lng: data.longitude,
  };

  if (!data) {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  
  return coordinates;
}

module.exports = getCoordsForAddress;