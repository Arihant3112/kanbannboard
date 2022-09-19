import { database } from "./../firebaseConfig";
import { Utility } from "./../Utilities/Utility";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import User from "./../Classes/User";
export default {
  state: {
    columns: [
      { name: "Not Started", id: "notStarted" },
      { name: "Started", id: "started" },
      { name: "In Progress", id: "inProgress" },
      { name: "Completed", id: "completed" },
    ],
    tasks: {
      notStarted: [],
      started: [],
      inProgress: [],
      completed: [],
    },
    defaultTaskState: "notStarted",
    notifications: [],
    tasksLoading: false,
  },
  getters: {
    getColumns(state) {
      return state.columns;
    },
    getTasks(state) {
      return state.tasks;
    },
    getNotifications(state) {
      return state.notifications;
    },
    getTasksLoader(state) {
      return state.tasksLoading;
    },
  },
  mutations: {
    addTask(state, params) {
      state.tasks[params.state].push(params);
    },
    resetTasks(state) {
      state.tasks = {
        notStarted: [],
        started: [],
        inProgress: [],
        completed: [],
      };
    },
    addNotificationRunningLate(state, params) {
      state.notifications.push({
        type: "late",
        task: params,
      });
    },
    addNotificationAssigned(state, params) {
      state.notifications.push({
        type: "assigned",
        task: params,
      });
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  actions: {
    getAllTasks({ commit, state, dispatch }) {
      let user = User.getCurrentUser();
      if (user) {
        // dispatch("clearTasks");
        //  dispatch("clearNotifications");
        state.tasksLoading = true;
        state.notifications = [];
        state.tasks = {
          notStarted: [],
          started: [],
          inProgress: [],
          completed: [],
        };
        const collectionRef = collection(database, "tasks");
        let qOwner = query(collectionRef, where("owner", "==", user.uid));
        let qAssign = query(
          collectionRef,
          where("assignedTo", "==", user.uid),
          where("owner", "!=", user.uid)
        );
        let allTasks = [];
        Promise.all([getDocs(qOwner), getDocs(qAssign)]).then(
          ([ownerData, assignData]) => {
            let ownerTaskData = ownerData.docs.map((taskData) => {
              return { id: taskData.id, ...taskData.data() };
            });
            let assignTaskData = assignData.docs.map((taskData) => {
              return { id: taskData.id, ...taskData.data() };
            });
            allTasks = ownerTaskData.concat(assignTaskData);
            //Segregate Tasks
            for (let i = 0; i < allTasks.length; i++) {
              if (
                allTasks[i].state != "completed" &&
                Utility.isDeadlineGone(allTasks[i].plannedEnd)
              ) {
                commit("addNotificationRunningLate", allTasks[i]);
              }
              if (allTasks[i].toNotify && allTasks[i].assignedTo == user.uid) {
                commit("addNotificationAssigned", allTasks[i]);
              }
              commit("addTask", allTasks[i]);
            }
            state.tasksLoading = false;
          }
        );
      }
    },
    addTask({ commit, state }, task) {
      return new Promise((resolve, reject) => {
        const collectionRef = collection(database, "tasks");
        let user = User.getCurrentUser();
        if (user) {
          let taskDoc = {
            state: state.defaultTaskState,
            title: task.title,
            description: "",
            owner: user.uid,
            assignedTo: user.uid,
            plannedEnd: "",
            toNotify: false,
          };
          addDoc(collectionRef, taskDoc)
            .then((res) => {
              commit(
                "setAlert",
                {
                  type: "success",
                  message: "Task Added Successfully.",
                  visible: true,
                },
                { root: true }
              );
              commit("addTask", taskDoc);
              resolve(res);
            })
            .catch((err) => {
              console.log(err.message);
              commit(
                "setAlert",
                {
                  type: "error",
                  message:
                    "Error Occured while Saving data! please try again later.",
                  visible: true,
                },
                { root: true }
              );
              reject(err);
            });
        }
      });
    },
    updateTask({ commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        const docRef = doc(database, "tasks", params.taskInfo.id);
        updateDoc(docRef, {
          state: params.taskInfo.state,
          title: params.taskInfo.title,
          description: params.taskInfo.description,
          owner: params.taskInfo.owner,
          assignedTo: params.taskInfo.assignedTo,
          plannedEnd: Timestamp.fromDate(new Date(params.plannedEnd)),
          toNotify:
            params.assigneeChanged &&
            params.taskInfo.owner != params.taskInfo.assignedTo,
        })
          .then((res) => {
            commit(
              "setAlert",
              {
                type: "success",
                message: "Task updated successfully",
                visible: true,
              },
              { root: true }
            );
            dispatch("clearTasks");
            dispatch("getAllTasks");
            resolve(res);
          })
          .catch((err) => {
            console.log(err.message);
            commit(
              "setAlert",
              {
                type: "error",
                message:
                  "Error Occured while updating data! please try again later.",
                visible: true,
              },
              { root: true }
            );
            reject(err);
          });
      });
    },
    changeState({ commit, state }, { itemId, fromColumn, toColumn }) {
      //find index
      let index;
      for (let i = 0; i < state.tasks[fromColumn].length; i++) {
        if (state.tasks[fromColumn][i].id == itemId) {
          index = i;
          break;
        }
      }
      const task = state.tasks[fromColumn].splice(index, 1);
      state.tasks[toColumn].push(task[0]);
      //update in firestore
      const docRef = doc(database, "tasks", itemId);
      updateDoc(docRef, {
        state: toColumn,
      })
        .then()
        .catch((err) => {
          console.log(err.message);
          commit(
            "setAlert",
            {
              type: "error",
              message:
                "Error Occured while updating Status! please try again later.",
              visible: true,
            },
            { root: true }
          );
        });
    },
    removeNotification({ commit }, task) {
      const docRef = doc(database, "tasks", task.id);
      updateDoc(docRef, {
        toNotify: false,
      });
    },
    clearTasks({ commit }) {
      commit("resetTasks");
    },
  },
};
