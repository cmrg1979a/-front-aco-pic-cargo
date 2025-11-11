<template>
  <v-container fluid>
    <SubGasto />
    <v-navigation-drawer
      v-model="$store.state.subgasto.drawer"
      right
      absolute
      bottom
      persistent
      width="30%"
      temporary
    >
      <FilterSubGasto />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  components: {
    SubGasto: () =>
      import("../../components/FolderGasto/listSubGastoCompponent.vue"),
    FilterSubGasto: () => import("../../components/filtros/FilterSubGasto.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `LISTADO DE SUB GASTO`;
  },
};
</script>

<style></style>
