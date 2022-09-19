<template>
  <v-dialog v-model="dialog" max-width="300px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>Add Task</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 100px">
        <v-text-field
          label="Task"
          hide-details="auto"
          v-model="title"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="saveTask" :loading="loading">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddTask",

  components: {},
  data: () => ({
    dialog: true,
    title: "",
    loading: false,
  }),
  methods: {
    saveTask() {
      this.loading = true;
      this.$store
        .dispatch("addTask", { title: this.title })
        .then(() => {
          this.loading = false;
          this.$emit("onClose");
        })
        .catch(() => {
          this.loading = false;
        });
      // this.$emit("onSaveTask");
    },
    closeDialog() {
      this.$emit("onClose");
    },
  },
};
</script>
<style></style>
