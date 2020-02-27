<template>
  <div class="root">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="tasklist-container">
      <div class="tasklist-header">
        <div class="tasklist-header-content">
          <div class="back"></div>
          <div class="tasklist-info">
            <h1>{{ tasklist }} </h1>
            <span> {{ activeTasks }} Tasks </span>
          </div>
        </div>
        <div class="tasklist-footer-content">
          <div class="date">
            <span class="day">{{ currentDate.date }}</span>
            <div class="month-year">
              <span>{{ currentDate.month }}</span>
              <span>{{ currentDate.year }}</span>
            </div>
          </div>
          <span class="dayOfWeek">{{ currentDate.day }}</span>
          <div style="flex-grow: 10;"></div>
          <div class="circular-btn toggle-complete" @click="showCompleted = !showCompleted" :class="[showCompleted ? 'true' : 'false']"></div>
          <div style="flex-grow: 1;"></div>
        </div>
      </div>
      <div class="tasklist">
        <div class="task" :class="[{'last' : index + 1 === tasks.length}, task.complete ? 'complete' : '']" v-for="(task, index) in sortedTasks" :key="task.id">
          <div class="completed" @click="task.complete = !task.complete"></div>
          <div class="task-info">
            <span>{{ task.title }}</span>
            <div style="flex-grow: 1;"></div>
            <div class="handle"></div>
          </div>
        </div>
      </div>
      <div class="tasklist-footer">
        <div class="circular-btn add-task" @click="addTask"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tasklist',
  data () {
    return {
      showCompleted: false,
      tasklist: 'Personal to-do',
      tasks: [
        {
          id: 1,
          title: 'Read an article',
          description: 'Just a random description, Nulla placerat ligula sem, sit amet molestie lectus commodo a.',
          order: 1,
          complete: false
        },
        {
          id: 2,
          title: 'Buy new sweatshirt',
          description: 'Just a random description, Nulla placerat ligula sem, sit amet molestie lectus commodo a.',
          order: 2,
          complete: true
        },
        {
          id: 3,
          title: 'Try not to fall asleep',
          description: 'Just a random description, Nulla placerat ligula sem, sit amet molestie lectus commodo a.',
          order: 3,
          complete: false
        }
      ]
    }
  },
  computed: {
    sortedTasks () {
      var toSort = this.tasks.slice(0)
      if (this.showCompleted) {
        toSort.sort(function (x, y) {
          // true values first
          // return (x.complete === y.complete) ? 0 : x.complete ? -1 : 1
          // false values first
          return (x.complete === y.complete) ? 0 : x.complete ? 1 : -1
        })
      }
      return toSort
    },
    currentDate () {
      var currentDate = new Date()
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      return {
        date: currentDate.getDate(),
        month: months[currentDate.getMonth()],
        year: currentDate.getFullYear(),
        day: daysOfWeek[currentDate.getDay()]
      }
    },
    activeTasks () {
      return this.tasks.length
    }
  },
  methods: {
    addTask () {
      var heighestID = 0
      for (let i = 0; i < this.tasks.length; i++) {
        if (heighestID <= this.tasks[i].id) {
          heighestID = this.tasks[i].id + 1
        }
      }

      this.tasks.push({
        id: heighestID,
        title: 'New item',
        description: 'Just a random description, Nulla placerat ligula sem, sit amet molestie lectus commodo a.',
        order: heighestID,
        complete: false
      })
    }
  }
}
</script>
