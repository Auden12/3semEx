new Vue({
  el: "#app",
  data() {
    return {
      nameToGetBy: "",
      desks: [],
      idToGetBy: -1,
      singleDesk: null,
      deleteId: 0,
      deleteMessage: "",
      addData: { name: "", id: 0, occupied: false },
      addMessage: "",
      updateData: { id: 0, name: "", occupied: false },
      updateMessage: "",
      showCalendar: false,
      currentDate: this.formatDate(new Date()), // Format the date
      events: [],
      baseUrl: "https://desksensor.azurewebsites.net/api/Desks",
      darkMode: false,
    };
  },
  methods: {
    getAllDesks() {
      this.getDesks(this.baseUrl);
    },
    getByName(name) {
      const url = `${this.baseUrl}?name=${name}`;
      this.getDesks(url);
    },
    async getDesks(url) {
      try {
        const response = await axios.get(url);
        this.desks = await response.data;
      } catch (ex) {
        alert(ex.message);
      }
    },
    async getById(id) {
      const url = `${this.baseUrl}/${id}`;
      try {
        const response = await axios.get(url);
        this.singleDesk = await response.data;
        this.updateData = { ...this.singleDesk }; // Populate updateData with the fetched desk data
      } catch (ex) {
        alert(ex.message);
      }
    },

    async deleteDesk(deleteId) {
      const url = `${this.baseUrl}/${deleteId}`;
      try {
        const response = await axios.delete(url);
        this.deleteMessage = `${response.status} ${response.statusText}`;
        this.getAllDesks();
      } catch (ex) {
        alert(ex.message);
      }
    },

    async updateDesk() {
      const url = `${this.baseUrl}/${this.updateData.id}`;
      try {
        const response = await axios.put(url, this.updateData);
        this.updateMessage = `response ${response.status} ${response.statusText}`;
        this.getAllDesks();
      } catch (ex) {
        alert(ex.message);
      }
    },

    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
      if (this.showCalendar) {
        this.initializeCalendar();
      }
    },
    initializeCalendar() {
      $("#calendar").fullCalendar({
        header: {
          left: "prev,next today",
          center: "title",
          right: "month,agendaWeek,agendaDay",
        },
        editable: true,
        droppable: true,
        events: this.events,
        selectable: true,
        selectHelper: true,
        select: (start, end) => {
          const title = prompt("Event Title:");
          const eventData = {
            title: title,
            start: start,
            end: end,
          };
          if (title) {
            $("#calendar").fullCalendar("renderEvent", eventData, true);
            this.events.push(eventData);
          }
          $("#calendar").fullCalendar("unselect");
        },
      });
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  mounted() {
    this.getAllDesks();
    if (this.darkMode) {
      document.body.classList.add("dark-mode");
    }
  },
  watch: {
    darkMode(newVal) {
      if (newVal) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    },
  },
});
