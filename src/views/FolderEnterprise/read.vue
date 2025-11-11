<template>
  <ReadEnterpriseComponent />
</template>

<script>
export default {
  components: {
    ReadEnterpriseComponent: () =>
      import("@/components/FolderEnterprise/read.vue"),
  },
};
</script>

<style></style>
