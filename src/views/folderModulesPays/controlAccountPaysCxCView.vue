<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col md="8" cols="12">
          <controlAccountReceivable tipo="ver" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import controlAccountReceivable from "@/components/folderModulesPays/controlAccountReceivable.vue";
export default {
  components: {
    controlAccountReceivable,
  },
  name: "controlAccountReceivableView",
};
</script>
