<template>
  <div class="kb-center-layout kb-signin">
    <div class="pd-4 kb-signin-contanier">
      <h2 class="text-center">Signin</h2>
      <v-text-field
        label="Email"
        hide-details="auto"
        v-model="email"
      ></v-text-field>
      <v-text-field
        label="Password"
        hide-details="auto"
        type="password"
        v-model="password"
      ></v-text-field>
      <div class="kb-center-layout mt-4">
        <v-btn elevation="2" @click="signin" rounded class="kb-btn"
          >Sign In</v-btn
        >
      </div>
      <div class="mt-2 text-center">
        <a>Not Registered Yet?</a>
        <router-link to="/signup" class="ml-1">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
export default {
  name: "Login",

  components: {},
  data: () => ({
    email: "",
    password: "",
  }),
  methods: {
    signin() {
      let auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          if (this.$router.currentRoute.name != "home") {
            this.$router.push({ name: "home" });
          }
        })
        .catch((err) => {
          let message = err.message.slice(10); //Hide Firebase:
          alert(message);
        });
    },
  },
};
</script>
