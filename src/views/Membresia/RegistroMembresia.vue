<template>
  <v-container fluid>
    <div class="centrado">
      <h4>¡Selecciona el/los módulos que deseas contratar para tu empresa!</h4>

    </div>
    <OpcionesMembresia />
  </v-container>
</template>

<script>
export default {
  components: {
    OpcionesMembresia: () =>
      import("@/components/Membresia/OpcionesMembresia.vue"),
  },
  mounted() {
    this.$store.state.drawer = false;
    this.$store.state.mainTitle = "Membresía";
  },
};
</script>

<style scope>
.centrado {
  text-align: center;
  align-content: center;
}
</style>
