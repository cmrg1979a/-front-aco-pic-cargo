<template>
  <UpdateEnterpriseComponent />
</template>

<script>
export default {
  components: {
    UpdateEnterpriseComponent: () =>
      import("@/components/FolderEnterprise/update.vue"),
  },
};
</script>

<style></style>
