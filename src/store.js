import "es6-promise/auto";
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      selectedTicker: null,
      availableCoins: [],
      watchedTickers: [],
    };
  },

  getters: {
    selectedTicker: (state) => {
      return state.selectedTicker;
    },
    availableCoins: (state) => {
      return state.availableCoins;
    },
    watchedTickers: (state) => {
      return state.watchedTickers;
    },
  },

  actions: {
    async fetchAwailableCoins({ commit }) {
      let response = await fetch(
        "https://min-api.cryptocompare.com/data/blockchain/list?api_key=aa9434795b47744b609cbde1f458c1f0b1d0548c273327fd6c5b06209e6e9282"
      );
      const data = await response.json();
      for (let coin in data.Data) {
        commit("addAvailableCoin", coin);
      }
    },
  },

  mutations: {
    selectTicker(state, ticker) {
      state.selectedTicker = ticker;
    },
    addAvailableCoin(state, coin) {
      state.availableCoins.push(coin);
    },
    addTicker(state, ticker) {
      state.watchedTickers.push(ticker);
    },
    removeTicker(state, toRemove) {
      state.watchedTickers = state.watchedTickers.filter((t) => t != toRemove);
    },
    addTickersFromJson(state, json) {
      state.watchedTickers = JSON.parse(json);
    },
  },
});

export default store;
