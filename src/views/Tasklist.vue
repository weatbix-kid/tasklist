<template>
  <div class="root">
    <div class="tasklist-container">
      <div class="tasklist-header">
        <div class="tasklist-header-content">
          <div class="back" @click="$router.go(-1)"></div>
          <div class="tasklist-info">
            <input v-model.lazy="tasklist.name" type="text">
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
            <input v-model.lazy="task.title" @keyup.enter="addTask('input', task)" v-taskInput type="text">
            <div style="flex-grow: 1;"></div>
          </div>
        </div>
        </transition-group>
        <div class="stats">
          <span v-show="activeTasks > 0">{{ completeTasks }} / {{ activeTasks }} Complete</span>
        </div>
      </div>
      <div class="tasklist-footer">
        <div class="circular-btn add-task" @click="addTask('button')"></div>
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
      var byOrder = toSort.sort(function (a, b) { return a.order - b.order })
      if (this.showCompleted) {
        byOrder.sort(function (a, b) {
          return (a.complete === b.complete) ? 0 : a.complete ? 1 : -1
        })
      } else {
        toSort = byOrder
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
    addTask (type, task) {
      var prevTask = task || null
      var heighestID = 0
      var nextOrder = 0

      for (let i = 0; i < this.tasklist.tasks.length; i++) {
        if (heighestID <= this.tasklist.tasks[i].id) {
          heighestID = this.tasklist.tasks[i].id + 1
        }
      }

      if (type === 'input') {
        if (nextOrder <= prevTask.order) {
          nextOrder = prevTask.order + 1
          // Loop all following tasks and increment orders by +1
          this.tasklist.tasks.forEach(task => {
            if (task.order >= prevTask.order + 1) {
              task.order++
            }
          })
        }
      } else if (type === 'button') {
        for (let i = 0; i < this.tasklist.tasks.length; i++) {
          if (nextOrder <= this.tasklist.tasks[i].order) {
            nextOrder = this.tasklist.tasks[i].order + 1
          }
        }
      } else {
        console.warn('No add type specified. Ignored item to add')
      }

      this.tasklist.tasks.push({
        id: heighestID,
        title: 'New item',
        description: 'Just a random description, Nulla placerat ligula sem, sit amet molestie lectus commodo a.',
        order: nextOrder,
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
    taskInput: {
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
