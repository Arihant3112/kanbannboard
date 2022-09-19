<template>
  <div class="kb-kanban">
    <div
      class="kb-kanban-column"
      v-for="column in columns"
      :key="column.id"
      @drop="onDrop($event, column.id)"
      @dragenter.prevent
      @dragover.prevent
    >
      <div class="kb-column-name">{{ column.name }}</div>
      <div v-if="tasksLoading">
        <v-skeleton-loader
          v-for="i in 8"
          :key="i"
          class="mx-auto mt-1"
          max-width="200"
          type="list-item"
        ></v-skeleton-loader>
      </div>
      <div
        v-else
        class="kb-column-item cursor-pointer"
        v-for="(task, ind) in allTasks[column.id]"
        :key="ind"
        @click="openTask(task)"
        @dragstart="startDrag($event, task, column.id)"
        draggable="true"
      >
        {{ task.title }}
      </div>
    </div>
    <view-task
      v-if="taskOpened"
      :taskInfo="currentTaskInfo"
      :owner="currentTaskInfo.owner"
      @onClose="closeTaskView"
    ></view-task>
  </div>
</template>

<script>
import ViewTask from "./ViewTask.vue";
export default {
  name: "MainHeader",

  components: { ViewTask },

  data: () => ({
    taskOpened: false,
    currentTaskInfo: {},
  }),
  created() {},
  computed: {
    columns() {
      return this.$store.getters.getColumns;
    },
    allTasks() {
      return this.$store.getters.getTasks;
    },
    tasksLoading() {
      return this.$store.getters.getTasksLoader;
    },
  },
  methods: {
    openTask(task) {
      this.currentTaskInfo = task;
      this.taskOpened = true;
      if (task.toNotify) {
        this.$store.dispatch("removeNotification", task);
      }
    },
    closeTaskView() {
      this.taskOpened = false;
    },
    startDrag(e, item, column) {
      e.dataTransfer.moveEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("itemId", item.id);
      e.dataTransfer.setData("fromColumn", column);
    },
    onDrop(e, column) {
      const id = e.dataTransfer.getData("itemId");
      const fromColumn = e.dataTransfer.getData("fromColumn");
      if (fromColumn != column) {
        this.$store.dispatch("changeState", {
          itemId: id,
          fromColumn: fromColumn,
          toColumn: column,
        });
      }
    },
  },
};
</script>
