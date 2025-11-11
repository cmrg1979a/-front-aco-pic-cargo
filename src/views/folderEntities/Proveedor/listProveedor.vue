<template>
  <v-container fluid>
    <v-card>
      <ListProveedorComponentVue />
    </v-card>
    <v-navigation-drawer
      v-model="$store.state.entities.filtrarProveedor"
      right
      absolute
      bottom
      persistent
      width="20%"
      temporary
    >
      <v-card elevation="0">
        <FiltroProveedor />
      </v-card>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  components: {
    ListProveedorComponentVue: () =>
      import(
        "@/components/folderEntities/Proveedor/ListProveedorComponent.vue"
      ),
    FiltroProveedor: () => import("@/components/filtros/FiltroProveedor.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `LISTADO DE PROVEEDORES`;
  },
};
</script>

<style></style>
