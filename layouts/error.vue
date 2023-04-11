<template>
  <v-row
    justify="center"
    class="text-center mt-16"
  >
    <v-col
      cols="10"
      sm="9"
      lg="6"
      xl="5"
    >
      <div
        class="mt-8"
        nuxt
        to="/"
      >
        Something went wrong.
        <br>
        <br>
        <a
          class="text-decoration-underline"
          @click="onClick"
        >Home</a>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "container",
  methods: {
    onClick() {
      if (this.$route.name === "index") {
        // Refresh page
        this.$router.go();
      } else {
        // Go to home page
        this.$router.push("/");
      }
    },
  },
};
</script>
