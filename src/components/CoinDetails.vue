<template>
  <spinner v-if="isLoading" />
  <div>
    <h1>{{ $route.params.name }}</h1>
    <div>From: {{ this.timeFrom }}</div>
    <div>To: {{ this.timeTo }}</div>
    <div>Len: {{ this.length }}</div>
  </div>
</template>

<script>
import Spinner from "./Spinner.vue";

export default {
  data() {
    return {
      timeFrom: "",
      timeTo: "",
      length: 0,
      isLoading: true,
    };
  },

  components: {
    Spinner,
  },

  methods: {
    fetchCoinInfo(coin) {
      setTimeout(async () => {
        let response = await fetch(
          `https://min-api.cryptocompare.com/data/blockchain/histo/day?fsym=${coin}&api_key=aa9434795b47744b609cbde1f458c1f0b1d0548c273327fd6c5b06209e6e9282`
        );
        const data = await response.json();
        this.isLoading = false;
        this.timeFrom = data.Data.TimeFrom;
        this.timeTo = data.Data.TimeTo;
        this.length = data.Data.Data.length;
      }, 2000);
    },
  },

  mounted() {
    this.fetchCoinInfo(this.$route.params.name);
  },
};
</script>
