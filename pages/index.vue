<template>
  <div class="max-width mx-auto">
    <v-text-field
      v-model="itemId"
      color="grey"
      label="ITEM ID"
      placeholder="Enter item ID"
      hint="Example: f7d62b56-1c44-4e77-a3c9-11a9b9a5c3de"
      persistent-hint
      persistent-placeholder
      outlined
      clearable
      autofocus
    />

    <v-btn
      class="mx-auto mt-4"
      color="primary"
      :to="`/${itemId}`"
      :disabled="!validItemId"
      nuxt
      block
      outlined
    >
      View Item
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    itemId: undefined,
  }),

  // Compute if itemId is in uuid v4 format
  computed: {
    validItemId() {
      const uuidV4Regex = new RegExp(
        "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        "i"
      );

      return uuidV4Regex.test(this.itemId);
    },
  },

  created() {},

  methods: {},
};
</script>

<!-- Setting lang="SCCSS" fixes reload issue -->
<!-- https://github.com/nuxt/nuxt/issues/5550 -->
<style lang="SCSS" scoped>
.max-width {
  width: 100%;
  max-width: 500px;
}
</style>
