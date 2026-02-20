<template>
  <v-container fluid>
    <v-card>
      <v-dialog
        v-model="dialogUrl"
        scrollable
        persistent
        max-width="30%"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title> Actualizar URL Carpeta </v-card-title>
          <v-card-text>
            <v-btn
              color="success"
              small
              :disabled="!masterEditar.url_folderonedrive"
              @click="to_link({ url: masterEditar.url_folderonedrive })"
            >
              Abrir <v-icon class="mx-1">mdi-folder-open-outline</v-icon>
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-text-field
              label="Nueva URL"
              id="id"
              v-model="url_folderonedrive"
              append-icon="mdi-folder-check"
              @click:append="actualizarUrl"
            ></v-text-field>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="cerrarDialog">Cerrar</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    dialogUrl: {
      type: Boolean,
      default: false,
    },
    masterEditar: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { url_folderonedrive: "" };
  },
  methods: {
    ...mapActions(["actualizarURLEnElMaster"]),
    to_link({ url = "" }) {
      window.open(url, "_blank");
    },
    async actualizarUrl() {
      await this.actualizarURLEnElMaster({
        id: this.masterEditar.id,
        url: this.url_folderonedrive,
      });
      this.masterEditar.url_folderonedrive = this.url_folderonedrive;
      this.cerrarDialog();
    },
    cerrarDialog() {
      this.$emit("cerrar");
    },
  },
  watch: {
    dialogUrl() {
      this.url_folderonedrive = "";
    },
  },
};
</script>

<style></style>
