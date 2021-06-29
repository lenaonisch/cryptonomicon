<template>
  <section class="inline-block">
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            v-on:keydown.enter.stop="add(ticker)"
            v-on:keyup.stop="findTips"
            type="text"
            name="wallet"
            id="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            v-for="(tip, idx) in tips"
            v-bind:key="idx"
            v-on:click="add($event.currentTarget.innerText)"
            class="
              inline-flex
              items-center
              px-2
              m-1
              rounded-md
              text-xs
              font-medium
              bg-gray-300
              text-gray-800
              cursor-pointer
            "
          >
            {{ tip }}
          </span>
        </div>
        <div v-if="isTickerExists" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
        <div v-if="isTickerAwailable" class="text-sm text-red-600">
          Такой тикер не существует
        </div>
      </div>
    </div>
    <add-button v-on:click="add()" />
  </section>
  <div class="inline-block">
    <slot name="advert" />
  </div>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  components: {
    AddButton,
  },

  props: {
    addedCoins: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      ticker: ``,
      isTickerExists: false,
      isTickerAwailable: false,
      tips: [],
      availableCoins: [],
    };
  },

  methods: {
    add(newName = this.ticker) {
      newName = newName.toUpperCase();
      this.isTickerAwailable = this.availableCoins.find((t) => t === newName);
      if (this.isTickerAwailable) {
        this.$emit("add-ticker", newName);
        this.ticker = "";
      }
    },

    findTips() {
      this.isTickerExists = false;
      this.tips = this.availableCoins
        .filter((t) => t.includes(this.ticker.toUpperCase()))
        .slice(0, 4);
    },

    async fetchAwailableCoins() {
      let response = await fetch(
        "https://min-api.cryptocompare.com/data/blockchain/list?api_key=aa9434795b47744b609cbde1f458c1f0b1d0548c273327fd6c5b06209e6e9282"
      );
      const data = await response.json();
      for (let coin in data.Data) {
        this.availableCoins.push(coin);
      }
    },
  },

  created: async function () {
    await this.fetchAwailableCoins();
  },
};
</script>
