<template>
  <div>
    <!-- Lista de cotizaciones -->
    <ServiciosTarifasComponent 
      v-if="!modoEditar"
      :key="componentKey" 
      :initial-shipment-code="$route.query.shipment"
    />
    
    <!-- Edición de tarifas específicas -->
    <EditarTarifasComponent 
      v-else
      :key="componentKey" 
    />
  </div>
</template>

<script>
import ServiciosTarifasComponent from "@/components/FolderPlantillas/ServiciosTarifasComponent.vue";
import EditarTarifasComponent from "@/components/FolderPlantillas/EditarTarifasComponent.vue";
import { mapActions } from "vuex";

export default {
  components: {
    ServiciosTarifasComponent,
    EditarTarifasComponent,
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  computed: {
    modoEditar() {
      return this.$route.query.modo === 'editar' && this.$route.query.cotizacion;
    }
  },
  async mounted() {
    if (this.$store.state.spinner !== undefined) {
      this.$store.state.spinner = true;
    }
    await Promise.all([
      this.getModality(),
      this.getShipment(),
      this._getProveedor(),
    ]);
    if (this.$store.state.spinner !== undefined) {
      this.$store.state.spinner = false;
    }
  },
  watch: {
    "$route.query"() {
      // Forzar remount del componente cuando cambian los query parameters
      this.componentKey += 1;
    },
  },
  methods: {
    ...mapActions(["getModality", "getShipment", "_getProveedor"]),
  },
};
</script>

<style scoped>
</style>
