<template>
  <div class="max-width mx-auto">
    <v-text-field
      v-model="itemId"
      label="ITEM ID"
      placeholder="Enter item ID"
      persistent-placeholder
      outlined
      rounded
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    itemId: undefined,
  }),

  created() {},

  methods: {},
};
</script>

<!-- Setting lang="SCCSS" fixes reload issue -->
<!-- https://github.com/nuxt/nuxt/issues/5550 -->
<style lang="SCSS" scoped>
.max-width {
  width: 500px;
}
</style>
