const { createApp } = Vue;

createApp({
  data() {
    return {
      events: [],
      eventNumber: null,
      eventDetails: {},
    };
  },
  created() {
    fetch("https://mindhub-xj03.onrender.com/api/amazing")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.events = data.events;
        let parametro = location.search;
        let searchPa = new URLSearchParams(parametro);
        let idEvent = searchPa.get("parametro");
        let idEventNumber = parseInt(idEvent, 10);
        this.eventNumber = idEventNumber;
        this.eventDetails = this.detailsEventsPage(); // Ejecutamos la funcion y guardamos los eventos en el objeto eventDetails
      })
      .catch((error) => error);
  },
  methods: {
    detailsEventsPage() {
      // Obtenemos los eventos por su id
      return this.events.find(
        (cardsEvents) => cardsEvents._id === this.eventNumber
      );
    },
  },
}).mount("#app");
