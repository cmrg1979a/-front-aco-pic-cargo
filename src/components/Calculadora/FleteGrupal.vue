<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="success" @click="abrirModal({ tipo: 'nuevo', item: {} })"
          >Nuevo Flete Grupal</v-btn
        >
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="$store.state.calculadoras.lstFleteGrupal"
        >
          <template v-slot:[`item.index`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn color="error" icon @click="eliminar(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              color="warning"
              icon
              @click="abrirModal({ tipo: 'editar', item: item })"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="20%"
      transition="dialog-transition"
    >
      <v-card class="pa-5">
        <v-card-title> Nuevo Registro </v-card-title>
        <v-form ref="frmNuevo">
          <v-text-field
            label="Volumen"
            type="number"
            v-model="form.volumen"
            :rules="[(v) => !!v || 'Dato Requerido']"
            step="0.01"
            suffix="m³"
          ></v-text-field>
          <v-text-field
            label="Peso"
            type="number"
            v-model="form.peso"
            :rules="[(v) => !!v || 'Dato Requerido']"
            step="0.01"
            suffix="kg"
          ></v-text-field>
          <v-text-field
            label="Valor"
            type="number"
            v-model="form.valor"
            :rules="[(v) => !!v || 'Dato Requerido']"
            step="0.01"
            prefix="$."
          ></v-text-field>
          <v-card-actions>
            <v-btn
              color="success"
              v-if="nuevoflag"
              small
              @click="guardarFleteGrupal"
            >
              Guardar
            </v-btn>
            <v-btn color="success" v-if="editarflag" @click="actualizar" small>
              Guardar
            </v-btn>
            <v-btn color="error" small @click="dialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  props: ["type"],
  data() {
    return {
      headers: [
        { text: "#", value: "index", sortable: false },
        { value: "volumen", text: "Volumen" },
        { value: "peso", text: "Peso" },
        { value: "valor", text: "Valor" },
        { text: "", value: "action", width: "5%" },
      ],
      dialog: false,
      form: {
        volumen: 0,
        peso: 0,
        valor: 0,
      },
      nuevoflag: false,
      editarflag: false,
    };
  },
  computed: {
    // ...mapState(["getFleteGrupal"]),
  },
  methods: {
    ...mapActions(["getFleteGrupal", "setFleteGrupal", "updateFleteGrupal"]),
    eliminar(element) {
      Swal.fire({
        icon: "question",
        title: "Eliminar",
        text: "¿Desea eliminar el registro?",
        confirmButtonText: "Si,Eliminar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then((res) => {
        if (res.isConfirmed) {
          this.updateFleteGrupal({ ...element, estado: false });
          this.getFleteGrupal({ tipo: this.type });
        }
      });
    },
    async actualizar() {
      if (this.editarflag) {
        await this.updateFleteGrupal({ ...this.form, estado: true });
        this.getFleteGrupal({ tipo: this.type });
        return;
      }
      Swal.fire({
        icon: "question",
        title: "Eliminar",
        text: "¿Desea eliminar el registro?",
        confirmButtonText: "Si,Eliminar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then(async (res) => {
        if (res.isConfirmed) {
          await this.updateFleteGrupal({ ...this.form, estado: false });
          this.getFleteGrupal({ tipo: this.type });
        }
      });
    },
    abrirModal({ tipo = "nuevo", item = {} }) {
      this.form.volumen = 1;
      this.form.peso = 1;
      this.form.valor = 1;
      this.nuevoflag = false;
      this.editarflag = false;
      this.dialog = true;
      this.$nextTick(() => {
        if (tipo == "nuevo") {
          this.nuevoflag = true;
        }
        if (tipo == "editar") {
          this.form = { ...item };
          this.editarflag = true;
        }
      });
    },
    async guardarFleteGrupal() {
      if (this.$refs.frmNuevo.validate()) {
        if (
          this.$store.state.calculadoras.lstFleteGrupal.some(
            (v) =>
              Number(v.volumen) === Number(this.form.volumen) ||
              Number(v.peso) === Number(this.form.peso),
          )
        ) {
          console.log("sss");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ya existe un valor asociado, al volumen, o peso",
          });
          return;
        }

        await this.setFleteGrupal(this.form);
        this.getFleteGrupal({ tipo: this.type });
        this.dialog = false;
      }
    },
  },
  mounted() {
    this.getFleteGrupal({ tipo: this.type });
  },
};
</script>

<style></style>
