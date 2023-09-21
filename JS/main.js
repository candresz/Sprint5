const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      checkBoxesCategories: [],
      checked: [],
      filtered: [],
      inputSearchValue: "",
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.events = data.events;
        this.filteringCategories();
        this.filtered = this.events;
      })
      .catch((error) => error);
  },
  methods: {
    filteringCategories() {
      this.checkBoxesCategories = [
        ...new Set(this.events.map((event) => event.category)),
      ].filter((category) => !this.checkBoxesCategories.includes(category));
    },

    filteringSearch(events, inputSearchValue) {
      return events.filter((event) => event.name.includes(inputSearchValue));
    },
    filteringCheckBoxes(events, checked) {
      if (checked.length == 0) {
        return this.events;
      }
      return events.filter((event) => checked.includes(event.category));
    },
    joiningFilters() {
      const searchFiltered = this.filteringSearch(
        this.events,
        this.inputSearchValue
      );
      const checkBoxFiltered = this.filteringCheckBoxes(
        searchFiltered,
        this.checked
      );
      this.filtered = checkBoxFiltered;
    },
  },
}).mount("#app");
