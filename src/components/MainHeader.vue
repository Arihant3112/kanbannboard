<template>
  <v-app-bar app class="kb-app-bar">
    <v-toolbar-title><h4>Kanban Board</h4></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn class="pull-right kb-btn" @click="emitAddTaskEvent" rounded
      >Add Task</v-btn
    >
    <notification />
    <v-menu bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="logout" class="cursor-pointer">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import User from "../Classes/User";
import Notification from "./Notification.vue";
export default {
  name: "MainHeader",

  components: { Notification },

  data: () => ({}),
  computed: {
    notifications() {
      return this.$store.getters.getNotifications;
    },
  },
  methods: {
    emitAddTaskEvent() {
      this.$emit("onAddTaskClick");
    },
    logout() {
      User.logout()
        .then(() => {
          this.$store.dispatch("clearTasks");
          if (this.$router.currentRoute.name != "signin") {
            this.$router.push({ name: "signin" });
          }
        })
        .catch(() => {
          alert("Some Error Occured");
        });
    },
  },
};
</script>
