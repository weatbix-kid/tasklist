<template>
  <div class="root">
    <div class="tasklist-container">
      <div class="tasklist-header">
        <div class="tasklist-header-content">
          <div class="back" @click="$router.go(-1)"></div>
          <div class="tasklist-info">
            <input v-model.lazy="tasklist.name" type="text">
            <!-- <h1> {{ tasklist }} </h1> -->
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
        <div class="task" :class="[{'last' : index + 1 === tasklist.tasks.length}, task.complete ? 'complete' : '']" v-for="(task, index) in sortedTasks" :key="task.id">
          <div v-if="!enableRemove" class="completed" @click="task.complete = !task.complete"></div>
          <div v-else class="remove" @click="removeTask(task.id)"></div>
          <div class="task-info">
            <input v-model.lazy="task.title" @keyup.enter="addTask()" v-task type="text">
            <div style="flex-grow: 1;"></div>
          </div>
        </div>
        </transition-group>
        <div class="stats">
          <span v-show="activeTasks > 0">{{ completeTasks }} / {{ activeTasks }} Complete</span>
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
      enableRemove: false,
      showSettings: false,
      showCompleted: false
    }
  },
  beforeDestroy () {
    this.$root.save()
  },
  computed: {
    tasklist () {
      var tasklistID = this.$route.query.list
      var validTasklist = this.$root.userData.tasklists.some(tasklist => tasklist.id === parseInt(tasklistID))
      var currentTasklist = {
        id: 0,
        name: '',
        tasks: []
      }

      if (validTasklist) {
        currentTasklist = this.$root.userData.tasklists.find(tasklist => tasklist.id === parseInt(tasklistID))
      }

      return currentTasklist
    },
    sortedTasks () {
      var toSort = this.tasklist.tasks.slice(0)
      if (this.showCompleted) {
        toSort.sort(function (x, y) {
          // true values first
          // return (x.complete === y.complete) ? 0 : x.complete ? -1 : 1
          // false values first
          return (x.complete === y.complete) ? 0 : x.complete ? 1 : -1
        })
      } else {
        // Sort by order number
        // Test in vue data
      }
      return toSort
    },
    completeTasks () {
      var count = 0
      this.tasklist.tasks.forEach(task => {
        if (task.complete) {
          count++
        }
      })
      return count
    },
    currentDate () {
      var currentDate = new Date()
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return {
        date: currentDate.getDate(),
        month: months[currentDate.getMonth()],
        year: currentDate.getFullYear(),
        day: daysOfWeek[currentDate.getDay()]
      }
    },
    activeTasks () {
      return this.tasklist.tasks.length
    }
  },
  methods: {
    addTask () {
      // If add while editing
      // Get selected task order // ??
      // Make new task with order +1
      // Loop all following tasks and increment orders by +1

      var heighestID = 0
      for (let i = 0; i < this.tasklist.tasks.length; i++) {
        if (heighestID <= this.tasklist.tasks[i].id) {
          heighestID = this.tasklist.tasks[i].id + 1
        }
      }
      this.tasklist.tasks.push({
        id: heighestID,
        title: 'New item',
        description: 'Just a random description, Nulla placerat ligula sem, sit amet molestie lectus commodo a.',
        order: heighestID,
        complete: false
      })
    },
    removeTask (id) {
      const taskRemoved = this.tasklist.tasks.slice(0).filter(task => task.id !== (id))
      this.tasklist.tasks = taskRemoved
      this.$root.save()
    }
  },
  directives: {
    task: {
      inserted (el) {
        el.focus()
        el.select()
      }
    }
  },
  watch: {
    tasklist: {
      handler () {
        this.tasklist.tasks.forEach(task => {
          if (task.title === '') {
            this.removeTask(task.id)
          }
        })
        this.$root.save()
      },
      // Deep to watch changes within array
      deep: true
    }
  }
}
</script>
