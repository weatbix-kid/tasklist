<template>
  <div class="root">
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
          <div class="circular-btn toggle-settings" @click.stop="showSettings = !showSettings; enableRemove = false" :class="[showSettings ? 'true' : 'false']">
            <div class="child-btn toggle-complete" @click.stop="showCompleted = !showCompleted" :class="[showSettings ? 'show' : '', showCompleted ? 'true' : '']"></div>
            <div class="child-btn toggle-delete" @click.stop="enableRemove = !enableRemove" :class="[showSettings ? 'show' : '', enableRemove ? 'true' : '']"></div>
          </div>
          <div style="flex-grow: 1;"></div>
        </div>
      </div>
      <div class="tasklist">
        <transition-group name="slide-fade">
        <div class="task" :class="[{'last' : index + 1 === tasks.length}, task.complete ? 'complete' : '']" v-for="(task, index) in sortedTasks" :key="task.id">
          <div v-if="!enableRemove" class="completed" @click="task.complete = !task.complete"></div>
          <div v-else class="remove" @click="removeTask(task.id)"></div>
          <div class="task-info">
            <input v-model.lazy="task.title" @keyup.enter="addTask()" v-focus type="text">
            <div style="flex-grow: 1;"></div>
          </div>
        </div>
        </transition-group>
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
      enableRemove: false,
      showSettings: false,
      showCompleted: false,
      tasklist: 'Personal to-do',
      tasks: []
    }
  },
  mounted () {
    this.load()
  },
  beforeDestroy () {
    this.save()
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
    },
    removeTask (id) {
      const taskRemoved = this.tasks.slice(0).filter(task => task.id !== (id))
      this.tasks = taskRemoved
      this.save()
    },
    save () {
      localStorage.setItem('userTaskData', JSON.stringify(this.tasks))
    },
    load () {
      if (localStorage.getItem('userTaskData')) {
        var data = JSON.parse(localStorage.getItem('userTaskData'))
        this.tasks = data
      }
    }
  },
  directives: {
    focus: {
      // When the bound element is inserted into the DOM...
      inserted (el) {
        el.focus()
        el.select()
      }
    }
  },
  watch: {
    tasks: {
      handler () {
        this.tasks.forEach(task => {
          if (task.title === '') {
            this.removeTask(task.id)
          }
        })
        this.save()
      },
      // Deep to watch changes within array
      deep: true
    }
  }
}
</script>
