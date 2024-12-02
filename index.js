const baseUrl = "https://teacherservice-awfggkftb9d3f3b8.northeurope-01.azurewebsites.net/api/Teachers"

new Vue({
  el: "#app",
  data() {
    return {
      nameToGetBy: '',
      teachers: [],
      idToGetBy: -1,
      singleTeacher: null,
      deleteId: 0,
      deleteMessage: "",
      addData: { name: "", salary: 0 },
      addMessage: "",
      updateData: { id: 0, name: "", salary: 0 },
      updateMessage: "",
      showCalendar: false,
      currentDate: new Date().toLocaleDateString(),
      events: []
    }
  },
  methods: {
    getAllTeachers() {
      this.getTeachers(this.base_url)
    },
    getByName(name) { // filter teachers by name
      const url = `${this.base_url}?name=${name}`
      this.getTeachers(url)
    },
    async getTeachers(url) { // helper method for getAllTeachers and getByName
      try {
        const response = await axios.get(url)
        this.teachers = await response.data
      } catch (ex) {
        alert(ex.message)
      }
    },
    async getById(id) {
      const url = `${this.base_url}/${id}`
      try {
        const response = await axios.get(url)
        this.singleTeacher = await response.data
      } catch (ex) {
        alert(ex.message)
      }
    },
    async deleteTeacher(deleteId) {
      const url = `${this.base_url}/${deleteId}`
      try {
        const response = await axios.delete(url)
        this.deleteMessage = `${response.status} ${response.statusText}`
        this.getAllTeachers()
      } catch (ex) {
        alert(ex.message)
      }
    },
    async addTeacher() {
      try {
        const response = await axios.post(this.base_url, this.addData)
        this.addMessage = `response ${response.status} ${response.statusText}`
        this.getAllTeachers()
      } catch (ex) {
        alert(ex.message)
      }
    },
    async updateTeacher() {
      const url = `${this.base_url}/${this.updateData.id}`
      try {
        const response = await axios.put(url, this.updateData)
        this.updateMessage = `response ${response.status} ${response.statusText}`
        this.getAllTeachers()
      } catch (ex) {
        alert(ex.message)
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
    }
  },
  mounted() {
    this.getAllTeachers();
  }
});