<template>
  <InsertEnterpriseComponent />
</template>

<script>
export default {
  components: {
    InsertEnterpriseComponent: () =>
      import("@/components/FolderEnterprise/nuevo.vue"),
  },
};
</script>

<style></style>
