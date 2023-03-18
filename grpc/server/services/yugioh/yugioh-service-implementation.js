const { default: axios } = require("axios");

function searchCards(call,callback) {
  let searchQuery = call.request.searchQuery;
  searchQuery = searchQuery.trim().toLowerCase();
  const apiUrl = `${process.env.API_BASE_URL}?fname=${searchQuery}`;

  axios.get(apiUrl)
    .then((response) => {
      const cards = response.data.data;
      callback(null,{
        cards: cards
      });
    })
    .catch((error) => {
      console.log(`[grpc/server/services/yugioh-service-implementation.js searchCards] Error: ${error?.message}`);
      callback(err);
    });
}


module.exports = {
  searchCards: searchCards
}