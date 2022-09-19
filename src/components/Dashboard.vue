<template>
  <v-app>
    <main-header @onAddTaskClick="openAddTaskDialog"></main-header>
    <header></header>
    <v-main>
      <div class="kb-container"><kanban></kanban></div>
    </v-main>
    <add-task
      v-if="addTaskDialogVisible"
      @onClose="closeAddTaskDialog"
    ></add-task>
  </v-app>
</template>

<script>
import MainHeader from "./MainHeader.vue";
import Kanban from "./Kanban.vue";
import AddTask from "./AddTask.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  name: "Dashboard",

  components: {
    MainHeader,
    Kanban,
    AddTask,
  },
  data: () => ({
    addTaskDialogVisible: false,
    firstTimeLoad: true,
  }),
  created() {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        if (this.$router.currentRoute.name != "signin") {
          this.$router.push({ name: "signin" });
        }
      } else if (this.firstTimeLoad) {
        this.firstTimeLoad = false;
        this.$store.dispatch("getAllTasks");
      }
    });
  },
  methods: {
    openAddTaskDialog() {
      this.addTaskDialogVisible = true;
    },
    closeAddTaskDialog() {
      this.addTaskDialogVisible = false;
    },
  },
};
</script>
