<template>
  <BalanceGeneral />
</template>

<script>
export default {
  components: {
    BalanceGeneral: () =>
      import("../../components/balances/balanceGanancia.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "ESTADO DE GANANCIA Y PERDIDAS";
  },
};
</script>

<style></style>
