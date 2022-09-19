<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
    <v-card>
      <v-card-title>{{ taskInfo.title }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 300px; overflow-y: auto">
        <v-text-field
          class="mt-2"
          label="Task"
          hide-details="auto"
          v-model="taskObjLocal.title"
          outlined
        ></v-text-field>
        <v-textarea
          class="mt-2"
          label="Description"
          v-model="taskObjLocal.description"
          outlined
        ></v-textarea>
        <v-select
          v-model="taskObjLocal.state"
          :items="maturityStates"
          item-text="name"
          item-value="id"
          label="Maturity State"
          outlined
        ></v-select>
        <v-autocomplete
          v-model="taskObjLocal.assignedTo"
          :items="usersList"
          item-text="name"
          item-value="uid"
          outlined
          dense
          label="Assignee"
        ></v-autocomplete>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-combobox
              v-model="plannedEnd"
              label="Planned End"
              outlined
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-combobox>
          </template>
          <v-date-picker v-model="plannedEnd" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(plannedEnd)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <label>Owner</label>
        <div>{{ ownerName }}</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="updateTask"
          :loading="loading"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import User from "./../Classes/User";
export default {
  name: "AddTask",
  components: {},
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    owner: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    dialog: true,
    ownerName: "",
    usersList: [],
    plannedEnd: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    loading: false,
  }),
  watch: {
    owner(newVal) {
      if (newVal.length > 0) {
        User.getUserName(newVal).then((userRecord) => {
          this.ownerName = userRecord;
        });
      }
    },
  },
  computed: {
    maturityStates() {
      return this.$store.getters.getColumns;
    },
    taskObjLocal() {
      User.getUserName(this.owner).then((userRecord) => {
        this.ownerName = userRecord[0];
      });
      User.getAllUsers().then((userRecords) => {
        this.usersList = userRecords;
      });
      if (this.taskInfo.plannedEnd) {
        this.plannedEnd = new Date(
          new Date(this.taskInfo.plannedEnd.seconds * 1000) -
            new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
      }
      //this.plannedEnd = new Date(this.taskInfo.plannedEnd.second * 1000);
      return JSON.parse(JSON.stringify(this.taskInfo));
    },
  },
  methods: {
    updateTask() {
      this.loading = true;
      this.$store
        .dispatch("updateTask", {
          taskInfo: this.taskObjLocal,
          plannedEnd: this.plannedEnd,
          assigneeChanged:
            this.taskInfo.assignedTo != this.taskObjLocal.assignedTo,
        })
        .then(() => {
          this.loading = false;
          this.$emit("onClose");
        })
        .catch(() => {
          this.loading = false;
        });
      //this.$store.dispatch("addTask", { title: this.title });
      // this.$emit("onSaveTask");
    },
    closeDialog() {
      this.$emit("onClose");
    },
  },
};
</script>
<style></style>
