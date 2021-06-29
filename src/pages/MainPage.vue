<template>
  <router-view />
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- <div
      class="
        fixed
        w-100
        h-100
        opacity-80
        bg-purple-800
        inset-0
        z-50
        flex
        items-center
        justify-center
      "
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div> -->
    <div class="container">
      <add-ticker v-on:add-ticker="add" :addedCoins="tickers">
        <template v-slot:advert>
          <simple-advert />
          <complex-advert />
        </template>
      </add-ticker>
      <template v-if="tickers.length > 0">
        <hr class="w-full border-t border-gray-600 my-4" />
        <button
          @click="page--"
          type="button"
          class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
          "
        >
          Назад
        </button>
        <div class="inline-block mx-4">{{ page }}</div>
        <button
          @click="onForwardClick"
          type="button"
          class="
            my-4
            mx-2
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
          "
          :disabled="forwardPageEnabled ? false : true"
          :class="{ 'hover:bg-gray-700': forwardPageEnabled }"
        >
          Вперед
        </button>
        <div class="max-w-xs">
          <label for="filter" class="block text-sm font-medium text-gray-700"
            >Фильтр</label
          >
          <div class="mt-1 relative rounded-md shadow-md">
            <input
              v-model="filter"
              type="text"
              name="filter"
              id="filter"
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
            />
          </div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <!-- v-bind:class="sel === t ? 'border-4' : ''"-->
          <div
            v-for="t in paginatedTickers"
            v-bind:key="t.name"
            v-on:click="select(t)"
            v-bind:class="{
              'border-4': selectedTicker === t,
            }"
            class="
              bg-white
              overflow-hidden
              shadow
              rounded-lg
              border-purple-800 border-solid
              cursor-pointer
            "
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ t.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <div class="text-center">
              <input type="checkbox" v-model="t.checked" v-on:click.stop="" />
              <label> Checked</label>
            </div>

            <button
              v-on:click.stop="handleDelete(t)"
              class="
                flex
                items-center
                justify-center
                font-medium
                w-full
                bg-gray-100
                px-4
                py-4
                sm:px-6
                text-md text-gray-500
                hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
                transition-all
                focus:outline-none
              "
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <graph
        ref="graphComponent"
        v-if="selectedTicker != null"
        :tickerName="selectedTicker.name"
        :graph="graph"
      />
      <div>Checked coins: {{ checkedCoins }}</div>
    </div>
  </div>
</template>

<script>
import AddTicker from "../components/AddTicker.vue";
import Graph from "../components/Graph.vue";
import SimpleAdvert from "../components/SimpleAdvert.vue";
import ComplexAdvert from "../components/ComplexAdvert.vue";

export default {
  name: "MainPage",
  components: {
    AddTicker,
    Graph,
    SimpleAdvert,
    ComplexAdvert,
  },

  data() {
    return {
      tickers: [],

      selectedTicker: null,
      isTickerExists: false,

      page: 1,
      filter: "",
    };
  },

  computed: {
    forwardPageEnabled() {
      return this.tickers.length > (this.page - 1) * 6; //because page is increased first
    },

    checkedCoins() {
      return this.tickers
        .filter((t) => t.checked)
        .map((t) => t.name)
        .join(", ");
    },

    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    filteredTickers() {
      if (this.filter !== "") {
        return this.tickers.filter((t) =>
          t.name.includes(this.filter.toUpperCase())
        );
      }
      return this.tickers;
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
  },

  // watch: {
  //   tickers: {
  //     handler() {
  //     },

  //     deep: true,
  //   },
  // },

  methods: {
    subscribeForUpdates(tickerName) {
      let intervalID = setInterval(async () => {
        let response = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=aa9434795b47744b609cbde1f458c1f0b1d0548c273327fd6c5b06209e6e9282`
        );
        const data = await response.json();
        let t = this.tickers.find((t) => t.name === tickerName);
        t.price = data.USD;
        t.intervalID = intervalID;

        if (this.selectedTicker?.name === tickerName) {
          this.$refs.graphComponent.graph.push(data.USD);
        }
      }, 3000);
    },

    add(newName = this.ticker) {
      newName = newName.toUpperCase();
      let newTicker = { name: newName, price: "-" };
      if (this.tickers.find((t) => t.name === newName) == undefined) {
        this.isTickerExists = false;
        this.tickers.push(newTicker);
        this.subscribeForUpdates(newTicker.name);

        localStorage.setItem("watched-coins", JSON.stringify(this.tickers));
        if (this.tickers.length > this.page * 6) {
          this.page = Math.floor(this.tickers.length / 6 + 1);
        }
      } else {
        this.isTickerExists = true;
      }
    },
    select(t) {
      this.selectedTicker = t;
    },

    handleDelete(toRemove) {
      clearInterval(this.tickers.find((t) => t === toRemove).intervalID);
      this.tickers = this.tickers.filter((t) => t != toRemove);
      if (this.selectedTicker == toRemove) {
        this.selectedTicker = null;
      }
      localStorage.setItem("watched-coins", JSON.stringify(this.tickers));
    },
    onForwardClick() {
      if (this.forwardPageEnabled()) {
        this.page++;
      }
    },
    getAddedCoins() {
      this.tickers = JSON.parse(localStorage.getItem("watched-coins"));
      if (this.tickers) {
        this.tickers.forEach((t) => this.subscribeForUpdates(t.name));
      } else {
        this.tickers = [];
      }
    },
  },

  created: async function () {
    this.getAddedCoins();
  },
};
</script>

<style src="../app.css"></style>
