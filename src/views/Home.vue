<template>
  <div class="root">
    <div @click="addTasklist">Add tasklist</div>
    <ul>
      <li v-for="tasklist in tasklists" :key="tasklist.id" @click="openTasklist(tasklist.id)">{{ tasklist.name }} {{ tasklist.numberOfTasks }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    addTasklist () {
      var heighestID = 0
      for (let i = 0; i < this.$root.userData.tasklists.length; i++) {
        if (heighestID <= this.$root.userData.tasklists[i].id) {
          heighestID = this.$root.userData.tasklists[i].id + 1
        }
      }
      this.$root.userData.tasklists.push({
        id: heighestID,
        name: 'New Tasklist',
        tasks: []
      })
    },
    openTasklist (id) {
      this.$router.push({ path: `tasklist?list=${id}` })
    }
  },
  computed: {
    tasklists () {
      const lcTasklists = []
      this.$root.userData.tasklists.forEach(tasklist => {
        lcTasklists.push({
          id: tasklist.id,
          name: tasklist.name,
          numberOfTasks: tasklist.tasks.length
        })
      })
      return lcTasklists
    }
  }
}
</script>
