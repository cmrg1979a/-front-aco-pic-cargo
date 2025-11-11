<template>
  <v-autocomplete
    :items="itemsPais"
    :auto-select-first="autoSelectFirst"
    :chips="chips"
    :clearable="clearable"
    :deletable-chips="deletableChips"
    :multiple="multiple"
    :small-chips="smallChips"
    :dense="dense"
    :filled="filled"
    :rounded="rounded"
    :solo="solo"
    :outlined="outlined"
    item-value="id"
    item-text="name"
    label="País"
    v-model="id"
    @change="$emit('paisSeleccionado', id)"
    :hide-details="!errorPais"
    :error-messages="errorPais"
  />
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  props: {
    errorPais: {
      type: String,
      default: "",
    },
    autoSelectFirst: {
      type: Boolean,
      default: false,
    },
    chips: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    deletableChips: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    smallChips: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    newId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return { id: "" };
  },
  async mounted() {
    await this._getPais();
  },
  methods: {
    ...mapActions(["_getPais"]),
  },
  computed: {
    ...mapState(["itemsPais"]),
  },
  watch: {
    newId() {
      if (this.newId) {
        this.id = this.newId;
      }
    },
    errorPais() {
      this.$forceUpdate();
      
    },
  },
};
</script>

<style></style>
