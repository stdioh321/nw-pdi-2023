const { default: axios } = require("axios");

async function searchCards(call,callback) {
  let { searchQuery } = call.request;
  searchQuery = searchQuery.trim().toLowerCase();
  const apiUrl = `${process.env.API_BASE_URL ?? 'https://db.ygoprodeck.com/api/v7/cardinfo.php'}?fname=${searchQuery}`;

  try {
    const { data: { data: cards } } = await axios.get(apiUrl);
    callback(null,{ cards });
  } catch (error) {
    error.message = error?.response?.data?.error ?? error?.message ?? 'Server error';
    if (error?.message?.match(/^No card matching your query was found in the database/)) {
      callback(null,{ cards: [] });
      return;
    }
    console.log(`[grpc/server/services/yugioh-service-implementation.js searchCards] Error: ${error.message}`);
    callback(error);
  }
}


module.exports = {
  searchCards: searchCards
}