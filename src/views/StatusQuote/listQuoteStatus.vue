<template>
  <v-container fluid>
    <listQuoteStatus />
    <v-navigation-drawer
      v-model="$store.state.QuoteStatus.drawer"
      right
      absolute
      bottom
      persistent
      width="30%"
      temporary
    >
      <FilterQuoteStatus :type="$store.state.airlines.tipo" />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  components: {
    listQuoteStatus: () =>
      import("./../../components/StatusQuote/listQuoteStatusComponent.vue"),
    FilterQuoteStatus: () =>
      import("../../components/filtros/FiltroQuoteStatus.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `LISTADO DE ESTADOS DE LA COTIZACIÓN`;
  },
};
</script>

<style></style>
