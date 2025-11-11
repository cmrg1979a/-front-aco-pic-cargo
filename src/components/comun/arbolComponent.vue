<template>
  <treeselect
    :multiple="false"
    :options="items"
    placeholder="Seleccione un Sub Gastos"
    v-model="selected"
    :disable-branch-nodes="true"
    label="Sub Gasto"
    search-nested
    dense
    outlined
  />
</template>

<script>
export default {
  props: {
    datos: Array,
  },

  mounted() {},
  data() {
    return {
      selected: null,
      items: [],
    };
  },
  methods: {
    handleSelect(option) {
      this.seleccion = option;
    },
  },
  watch: {
    datos() {
      this.items = datos;
    },
  },
};
</script>

<style></style>
