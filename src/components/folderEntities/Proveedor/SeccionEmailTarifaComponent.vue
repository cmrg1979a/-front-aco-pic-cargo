<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="py-1" style="text-transform: uppercase">
        <v-spacer></v-spacer>
        <v-btn color="success" @click="guardarContactos">Guardar</v-btn>
      </v-col>
      <v-col cols="12" class="py-1" style="text-transform: uppercase">
        <center>
          <h5>Contactos de Importación</h5>
        </center>
      </v-col>

      <v-col cols="12" class="py-1">
        <v-btn color="info" x-small @click="agregarContacto">
          Añadir Nuevo Contacto</v-btn
        >
      </v-col>

      <v-col cols="12" class="py-1">
        <v-data-table
          :headers="headers"
          :items="itemsImportacion"
          class="elevation-1"
        >
          <template v-slot:[`item.index`]="{ item, index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.contacto`]="{ item, index }">
            <v-text-field
              hide-details
              v-model="item.contacto"
              dense
              outlined
              :id="`contactoimport${index}`"
            ></v-text-field>
          </template>
          <template v-slot:[`item.email`]="{ item }">
            <v-text-field
              hide-details
              v-model="item.email"
              dense
              outlined
            ></v-text-field>
          </template>
          <template v-slot:[`item.telefono`]="{ item }">
            <v-text-field
              hide-details
              v-model="item.telefono"
              dense
              outlined
            ></v-text-field>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn color="red" icon @click="eliminarContacto(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" style="text-transform: uppercase">
        <center>
          <h5>Contactos de Exportación</h5>
        </center>
      </v-col>

      <v-col cols="12" class="py-1">
        <v-btn color="info" x-small @click="agregarContactoExportacion">
          Añadir Nuevo Contacto
        </v-btn>
      </v-col>

      <v-col cols="12" class="py-1">
        <v-data-table
          :headers="headers"
          :items="itemsExportacion"
          class="elevation-1"
        >
          <template v-slot:[`item.index`]="{ item, index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.contacto`]="{ item, index }">
            <v-text-field
              hide-details
              v-model="item.contacto"
              dense
              outlined
              :id="`contactoexport${index}`"
            ></v-text-field>
          </template>
          <template v-slot:[`item.email`]="{ item }">
            <v-text-field
              hide-details
              v-model="item.email"
              dense
              outlined
            ></v-text-field>
          </template>
          <template v-slot:[`item.telefono`]="{ item }">
            <v-text-field
              hide-details
              v-model="item.telefono"
              dense
              outlined
            ></v-text-field>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn color="red" icon @click="eliminarContacto(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SeccionEmailTarifa",
  data() {
    return {
      headers: [
        { text: "#", value: "index" },

        {
          text: "Contacto",
          align: "start",
          sortable: false,
          value: "contacto",
        },
        { text: "Email", value: "email" },
        { text: "Telefono", value: "telefono" },
        { text: "", value: "action" },
      ],
      itemsImportacion: [],
      itemsExportacion: [],
    };
  },
  async mounted() {
    await this.cargarDatosTatifasEntite({ id: this.$route.params.id });
    this.itemsImportacion = this.$store.state.entities.lstDatosTarifas.filter(item => item.code === "I");
    this.itemsExportacion = this.$store.state.entities.lstDatosTarifas.filter(item => item.code === "E");
  },
  methods: {
    ...mapActions(["cargarDatosTatifasEntite"]),
    agregarContactoExportacion() {
      this.itemsExportacion.push({
        code: "E",
        contacto: "",
        email: "",
        telefono: "",
      });
      this.$nextTick(() => {
        const index = this.itemsExportacion.length - 1;
        const contactoInput = document.getElementById(`contactoexport${index}`);
        if (contactoInput) {
          contactoInput.focus();
        }
      });
    },
    agregarContacto() {
      this.itemsImportacion.push({
        code: "I",
        contacto: "",
        email: "",
        telefono: "",
      });
      this.$nextTick(() => {
        const index = this.itemsImportacion.length - 1;
        const contactoInput = document.getElementById(`contactoimport${index}`);
        if (contactoInput) {
          contactoInput.focus();
        }
      });
    },
    guardarContactos() {
      let datos = [...this.itemsImportacion, ...this.itemsExportacion];
      console.log("Contactos guardados:", datos);
    },
  },
};
</script>

<style></style>
