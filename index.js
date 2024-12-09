const baseUrl = "https://desksensor.azurewebsites.net/api/Desks";

new Vue({
  el: "#app",
  data() {
    return {
      nameToGetBy: '',
      desks: [],
      idToGetBy: -1,
      singleDesk: null,
      deleteId: 0,
      deleteMessage: "",
      addData: { name: "", salary: 0 },
      addMessage: "",
      updateData: { id: 0, name: "", salary: 0 },
      updateMessage: "",
      showCalendar: false,
      currentDate: new Date().toLocaleDateString(),
      events: [],
      darkMode: false,
    }
  },
  methods: {
    getAllDesks() {
      this.getDesks(baseUrl)
    },
    async getDesks(url) {
      try {
        console.log(`Fetching desks from ${url}`);
        const response = await axios.get(url);
        console.log('Response:', response);
        this.desks = response.data;
      } catch (ex) {
        console.error('Error fetching desks:', ex);
        alert(ex.message);
      }
    },
    getById(id) {
      console.log(`Searching for desk with ID ${id}`);
      const desk = this.desks.find(desk => desk.id === parseInt(id));
      if (desk) {
        this.singleDesk = desk;
        console.log('Found desk:', desk);
      } else {
        console.log('Desk not found');
        alert('Desk not found');
        this.singleDesk = null;
      }
    },
    async deleteDesk(deleteId) {
      const url = `${baseUrl}/${deleteId}`;
      try {
        console.log(`Deleting desk by ID from ${url}`);
        const response = await axios.delete(url);
        console.log('Response:', response);
        this.deleteMessage = `${response.status} ${response.statusText}`;
        this.getAllDesks();
      } catch (ex) {
        console.error('Error deleting desk:', ex);
        alert(ex.message);
      }
    },
    async addDesk() {
      try {
        console.log(`Adding desk to ${baseUrl}`);
        const response = await axios.post(baseUrl, this.addData);
        console.log('Response:', response);
        this.addMessage = `response ${response.status} ${response.statusText}`;
        this.getAllDesks();
      } catch (ex) {
        console.error('Error adding desk:', ex);
        alert(ex.message);
      }
    },
    async updateDesk() {
      const url = `${baseUrl}/${this.updateData.id}`;
      try {
        console.log(`Updating desk by ID from ${url}`);
        const response = await axios.put(url, this.updateData);
        console.log('Response:', response);
        this.updateMessage = `response ${response.status} ${response.statusText}`;
        this.getAllDesks();
      } catch (ex) {
        console.error('Error updating desk:', ex);
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
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true,
        events: this.events,
        selectable: true,
        selectHelper: true,
        select: (start, end) => {
          const title = prompt('Event Title:');
          const eventData = {
            title: title,
            start: start,
            end: end
          };
          if (title) {
            $('#calendar').fullCalendar('renderEvent', eventData, true);
            this.events.push(eventData);
          }
          $('#calendar').fullCalendar('unselect');
        }
      });
    },
    toggleDarkMode() {
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    checkTimeForDarkMode() {
      const now = new Date();
      const hours = now.getHours();
      if (hours >= 18 || hours < 6) {
        this.darkMode = true;
        document.body.classList.add('dark-mode');
      } else {
        this.darkMode = false;
        document.body.classList.remove('dark-mode');
      }
    }
  },
  mounted() {
    this.getAllDesks();
    this.checkTimeForDarkMode();
  }
});