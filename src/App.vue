<template>
  <v-app id="kb">
    <v-alert
      v-if="showAlert.visible"
      :type="showAlert.type"
      :dismissible="true"
      >{{ showAlert.message }}</v-alert
    >
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},
  data: () => ({}),
  computed: {
    showAlert() {
      return this.$store.getters.getAlertState;
    },
  },
};
</script>
