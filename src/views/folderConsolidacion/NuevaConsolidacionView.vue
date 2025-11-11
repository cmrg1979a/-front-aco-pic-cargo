<template>
  <nuevaConsolidacion />
</template>

<script>
export default {
  components: {
    nuevaConsolidacion: () =>
      import("@/components/folderConsolidacion/newConsolidacion.vue"),
  },
};
</script>

<style></style>
