<template>
  <v-menu bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon v-if="notifications.length == 0">mdi-bell</v-icon>
        <v-icon v-else>mdi-bell-badge</v-icon>
      </v-btn>
    </template>

    <v-list v-if="notifications.length > 0">
      <v-list-item class="cursor-pointer" v-for="note in notifications">
        <v-list-item-title>
          <div v-if="note.type == 'late'">
            You have task titled as
            <strong>{{ note.task.title }}</strong> running late
          </div>
          <div v-else-if="note.type == 'assigned'">
            You have a new task assigned to you titled as
            <strong>{{ note.task.title }}</strong>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "Notification",

  components: {},

  data: () => ({}),
  computed: {
    notifications() {
      return this.$store.getters.getNotifications;
    },
  },
  methods: {},
};
</script>
