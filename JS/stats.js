const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      upcomingEvents: [],
      categoriesUpcoming: [],
      upComing2Table: [],

      pastEvents: [],
      categoriesPast: [],
      past3Table: [],

      highestAttendance: null,
      highestAttendanceEvent: null,
      lowestAttendance: null,
      lowestAttendanceEvent: null,
      highestCapacity: null,
      highestCapacityEvent: null,
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.events = data.events;
        this.pastEvents = data.events.filter((event) => {
          return event.date <= data.currentDate;
        });
        this.upcomingEvents = data.events.filter((event) => {
          return event.date >= data.currentDate;
        });

        const highestAttendanceInfo = this.findHighestAttendance();
        const lowestAttendanceInfo = this.findLowestAttendance();
        const highestCapacityInfo = this.findHighestCapacity();

        this.highestAttendance = highestAttendanceInfo.number;
        this.highestAttendanceEvent = highestAttendanceInfo.event;
        this.lowestAttendance = lowestAttendanceInfo.number;
        this.lowestAttendanceEvent = lowestAttendanceInfo.event;
        this.highestCapacity = highestCapacityInfo.number;
        this.highestCapacityEvent = highestCapacityInfo.event;
        this.filteringCategories();
        this.filteringCategoriesPast();

        this.upComing2Table = this.exportingEvCategories();
        this.past3Table = this.exportingEvCategoriesPast();
      })
      .catch((error) => console.error(error));
  },
  methods: {
    filteringCategories() {
      this.categoriesUpcoming = [
        ...new Set(this.upcomingEvents.map((event) => event.category)),
      ].filter((category) => !this.categoriesUpcoming.includes(category));
    },
    findHighestAttendance() {
      let maxAttendance = 0;
      let eventWithMaxAttendance = null;

      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i];
        const totalAttendance = event.assistance || event.estimate;
        if (totalAttendance > maxAttendance) {
          maxAttendance = totalAttendance;
          eventWithMaxAttendance = event;
        }
      }

      return {
        number: (
          (maxAttendance / eventWithMaxAttendance.capacity) *
          100
        ).toFixed(),
        event: eventWithMaxAttendance.name,
      };
    },
    findLowestAttendance() {
      let lowAttendance = Infinity;
      let eventWithLowAttendance = null;

      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i];
        const totalAttendance = event.assistance || event.estimate;
        if (totalAttendance < lowAttendance) {
          lowAttendance = totalAttendance;
          eventWithLowAttendance = event;
        }
      }

      return {
        number: (
          (lowAttendance / eventWithLowAttendance.capacity) *
          100
        ).toFixed(),
        event: eventWithLowAttendance.name,
      };
    },
    findHighestCapacity() {
      let maxCapacity = 0;
      let eventWithMaxCapacity = null;

      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i];
        if (event.capacity > maxCapacity) {
          maxCapacity = event.capacity;
          eventWithMaxCapacity = event;
        }
      }

      return {
        number: maxCapacity,
        event: eventWithMaxCapacity.name,
      };
    },
    exportingEvCategories() {
      const categorizedEvents = this.categoriesUpcoming.map((category) => {
        // Filtra los eventos que pertenecen a la categoría actual
        const eventsInCategory = this.upcomingEvents.filter(
          (event) => event.category === category
        );

        return {
          category: category,
          events: eventsInCategory,
        };
      });

      return categorizedEvents; // Devuelve el resultado final
    },
    calculateCategoryRevenue(eventsInCategory) {
      let total = 0;
      for (let i = 0; i < eventsInCategory.length; i++) {
        let formula =
          eventsInCategory[i].assistance ||
          eventsInCategory[i].estimate * eventsInCategory[i].price;
        total += formula;
      }
      return total;
    },

    calculateAttendancePercentage(eventsInCategory) {
      let totalAttendance = 0;
      let totalCapacity = 0;

      for (const event of eventsInCategory) {
        // Asumiendo que cada evento tiene una propiedad 'assistance' y 'capacity'
        totalAttendance += event.assistance || event.estimate;
        totalCapacity += event.capacity;
      }

      if (totalCapacity === 0) {
        return 0; // Para evitar la división por cero si no hay capacidad definida
      }

      return ((totalAttendance / totalCapacity) * 100).toFixed(); // Calcula el porcentaje y redondea a dos decimales
    },
    filteringCategoriesPast() {
      this.categoriesPast = [
        ...new Set(this.pastEvents.map((event) => event.category)),
      ].filter((category) => !this.categoriesPast.includes(category));
    },
    exportingEvCategoriesPast() {
      const categorizedEvents = this.categoriesPast.map((category) => {
        // Filtra los eventos que pertenecen a la categoría actual en this.pastEvents
        const eventsInCategory = this.pastEvents.filter(
          (event) => event.category === category
        );

        return {
          category: category,
          events: eventsInCategory,
        };
      });

      return categorizedEvents; // Devuelve el resultado final
    },
  },
}).mount("#app");
