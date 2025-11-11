<template>
  <v-container fluid>
    <v-card>
      <ListPersonaRol />
    </v-card>
  </v-container>
</template>

<script>
export default {
  components: {
    ListPersonaRol: () =>
      import(
        "../../../components/Security/RolPersona/listPersonaRolComponent.vue"
      ),
  },
  mounted(){
    this.$store.state.mainTitle = 'ASIGNAR ROLES A PERSONAS'
  }
};
</script>

<style></style>
