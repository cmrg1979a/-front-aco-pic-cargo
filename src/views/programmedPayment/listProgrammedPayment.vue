<template>
  <LitProgrammedPaymentView />
</template>

<script>
export default {
  name: "listProgrammedPaymentView",
  components: {
    LitProgrammedPaymentView: () =>
      import("../../components/ProgrammedPayment/listProgrammedPayment.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "LISTADO DE PAGOS PROGRAMADOS";
  },
};
</script>

<style></style>
