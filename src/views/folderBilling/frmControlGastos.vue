<template>
  <formularioControlGastos />
</template>
<script>
export default {
  components: {
    formularioControlGastos: () =>
      import("@/components/folderBilling/frmControlGastos.vue"),
  },
};
</script>
