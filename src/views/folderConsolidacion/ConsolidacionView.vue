<template>
  <listConsolidacion />
</template>

<script>
export default {
  components: {
    listConsolidacion: () =>
      import("@/components/folderConsolidacion/lstConsolidacion.vue"),
  },
};
</script>

<style></style>
