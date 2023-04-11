<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar
      dark
      app
      flat
    >
      <!-- Overlay button -->
      <v-btn
        color="white"
        light
        small
        rounded
      >
        <v-icon
          small
          class="mr-1"
        >
          mdi-cube-outline mdi-spin
        </v-icon>
        {{ "Real Items" }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-4 py-sm-6 py-md-8">
        <!-- Snackbar -->
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          rounded="pill"
          class="mt-4"
          top
          centered
          timeout="6000"
        >
          <div class="font-weight-medium ml-2">
            {{ snackbarText }}
          </div>

          <template #action="{ attrs }">
            <v-btn
              class="mr-3"
              v-bind="attrs"
              x-small
              plain
              icon
              @click="snackbar = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer
      height="200"
      absolute
      app
      color="transparent"
    >
      <div class="text-center mx-auto">
        <div>
          Learn more at
          <a
            target="_blank"
            href="https://docs.realitems.io/"
          >
            docs.realitems.io
          </a>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarText: undefined,
      snackbarColor: undefined,
    };
  },

  created() {
    // Handle toast events
    this.$nuxt.$on("toast", (status, text) => {
      // Fallback text
      if (text === undefined) {
        text = status === "success" ? "Success" : "Error: Something went wrong";
      }

      this.snackbarText = text;
      this.snackbarColor =
        status === "success" ? "blue darken-4" : "red darken-2";

      this.snackbar = true;
    });
  },

  methods: {
    test() {
      this.$nuxt.$emit("toast", "error", "An error occurred, try again later");
    },
  },
};
</script>
