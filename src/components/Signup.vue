<template>
  <div class="kb-center-layout kb-signin">
    <div class="pd-4 kb-signin-contanier">
      <h2 class="text-center">SignUp</h2>
      <v-text-field
        label="Name"
        hide-details="auto"
        v-model="name"
        :rules="nameRules"
        required
      ></v-text-field>
      <v-text-field
        label="Email"
        hide-details="auto"
        v-model="email"
        :rules="emailRules"
        required
      ></v-text-field>
      <v-text-field
        type="password"
        label="Create Password"
        hide-details="auto"
        v-model="password"
        required
      ></v-text-field>
      <div class="kb-center-layout mt-4">
        <v-btn elevation="2" @click="registerUser" rounded class="kb-btn"
          >Sign Up</v-btn
        >
      </div>
      <div class="mt-1 text-center">
        <a>Already Registered?</a>
        <router-link to="/" class="ml-1">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import User from "./../Classes/User";
export default {
  name: "Signup",

  components: {},
  data: () => ({
    name: "",
    email: "",
    password: "",
    nameRules: [(v) => !!v || "Name is required"],
    emailRules: [(v) => !!v || "Email is required"],
  }),
  methods: {
    registerUser() {
      if (this.name.trim().length == 0) return;
      let auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((res) => {
          auth = getAuth();
          //Save Username
          updateProfile(auth.currentUser, { displayName: this.name })
            .then(() => {
              if (this.$router.currentRoute.name != "home") {
                this.$router.push({ name: "home" });
              }
            })
            .catch(() => {
              console.log("some error occured");
            });
          //Add to Users Collection
          User.addUser(auth.currentUser.uid, this.name)
            .then(() => {})
            .catch(() => {
              console.log("some error occured");
            });
        })
        .catch((err) => {
          let message = err.message.slice(10); //hide firebase
          alert(message);
        });
    },
  },
};
</script>
