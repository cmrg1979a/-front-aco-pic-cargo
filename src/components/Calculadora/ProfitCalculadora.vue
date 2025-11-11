<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-pagination
          v-model="opcionCalculadora"
          :length="2"
          circle
        ></v-pagination>
      </v-col>
      <v-col cols="12">
        <v-btn color="success" small @click="abrirModal">Nuevo</v-btn>
      </v-col>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="obtenerValoresProfitPorOpcion">
          <template v-slot:[`item.estado`]="{ item }">
            {{ item.estado ? "Activo" : "Anulado" }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn color="warning" v-if="item.estado" icon @click="abrirModalEditar(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" v-if="item.estado" icon @click="borrarProfit(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogNuevoProfit" scrollable persistent max-width="30%">
      <v-card>
        <v-form ref="frmNuevo">
          <v-card-title v-if="nuevoflag"> Nuevo Profit </v-card-title>
          <v-card-title v-if="editarflag"> Actualizar Profit </v-card-title>
          <v-card-text>
            <v-text-field
              type="number"
              name="Profit"
              label="Profit"
              v-model="profit"
              :rules="[(v) => !!v || 'Dato Requerido']"
            />
            <v-text-field
              type="number"
              name="Peso"
              label="Peso"
              v-model="peso"
              :rules="[(v) => !!v || 'Dato Requerido']"
            />
            <v-text-field
              type="number"
              name="volumen"
              label="Volumen"
              v-model="volumen"
              :rules="[(v) => !!v || 'Dato Requerido']"
            />
            <v-text-field
              type="number"
              name="valor"
              label="Valor"
              v-model="valor"
              :rules="[(v) => !!v || 'Dato Requerido']"
            />
            <v-text-field
              type="number"
              name="M³ "
              label="M³ "
              v-model="metromc"
              :rules="[(v) => !!v || 'Dato Requerido']"
            />
            <v-text-field
              type="number"
              name="M³ Adicional"
              label="M³ Adicional"
              v-model="metromcad"
              :rules="[(v) => !!v || 'Dato Requerido']"
            />
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="nuevoflag"
            color="success"
            small
            class="mx-1"
            @click="guardarProfit"
          >
            Guardar
          </v-btn>
          <v-btn
            v-if="editarflag"
            color="success"
            small
            class="mx-1"
            @click="actualizarProfit"
          >
            Actualizar
          </v-btn>
          <v-btn
            color="error"
            small
            class="mx-1"
            @click="dialogNuevoProfit = !dialogNuevoProfit"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex/dist/vuex.common.js";
import Swal from "sweetalert2";
export default {
  props: {
    type: {
      default: "type",
      type: String,
    },
    id_modality: {
      default: 1,
      type: Number,
    },
  },
  data() {
    return {
      dialogNuevoProfit: false,
      headers: [
        { value: "profit", text: "PROFIT" },
        { value: "peso", text: "PESO" },
        { value: "volumen", text: "VOLUMEN" },
        { value: "valor", text: "VALOR DE CARGA" },
        { value: "estado", text: "Estado" },
        { value: "metromc", text: "M³" },
        { value: "metromcad", text: "M³ Adicional" },
        { value: "action", text: "" },
      ],
      items: [],
      id: null,
      profit: 0,
      peso: 0,
      volumen: 0,
      valor: 0,
      metromc: 0,
      metromcad: 0,
      nuevoflag: true,
      editarflag: false,
    };
  },
  methods: {
    ...mapActions([
      "postGuardarProfit",
      "getProfitList",
      "actualizarGuardarProfit",
      "eliminarGuardarProfit",
    ]),
    async guardarProfit() {
      if (this.$refs.frmNuevo.validate()) {
        let data = {
          id_modality: this.id_modality,
          shimpent: this.type,
          profit: this.profit,
          peso: this.peso,
          volumen: this.volumen,
          valor: this.valor,
          opcion: this.$store.state.calculadoras.opcionCalculadora,
          metromc: this.metromc,
          metromcad: this.metromcad,
        };
        await this.postGuardarProfit(data);
        this.dialogNuevoProfit = false;
        await this.getProfitList(data);
      }
    },
    borrarProfit(item) {
      let data = {
        id_modality: this.id_modality,
        shimpent: this.type,
        profit: this.profit,
        peso: this.peso,
        volumen: this.volumen,
        valor: this.valor,
        opcion: this.$store.state.calculadoras.opcionCalculadora,
        metromc: this.metromc,
        metromcad: this.metromcad,
      };
      Swal.fire({
        icon: "question",
        title: "Anular Profit?",
        text: "Desea anular el profit",
        confirmButtonText: "Si, eliminar",
        denyButtonText: "Cancelar",
        showDenyButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(async (res) => {
        if (res.isConfirmed) {
          await this.eliminarGuardarProfit(item);
          await this.getProfitList(data);
        }
      });
    },
    async actualizarProfit() {
      if (this.$refs.frmNuevo.validate()) {
        let data = {
          id: this.id,
          id_modality: this.id_modality,
          shimpent: this.type,
          profit: this.profit,
          peso: this.peso,
          volumen: this.volumen,
          valor: this.valor,
          opcion: this.$store.state.calculadoras.opcionCalculadora,
          metromc: this.metromc,
          metromcad: this.metromcad,
        };
        await this.actualizarGuardarProfit(data);
        this.dialogNuevoProfit = false;
        await this.getProfitList(data);
      }
    },
    abrirModal() {
      this.dialogNuevoProfit = true;
      this.nuevoflag = true;
      this.editarflag = false;
      this.$nextTick(() => {
        this.$refs.frmNuevo.reset();
      });
    },
    abrirModalEditar(profit) {
      this.dialogNuevoProfit = true;
      this.nuevoflag = false;
      this.editarflag = true;
      this.$nextTick(() => {
        // this.$refs.frmNuevo.reset();
        this.id = profit.id;
        this.profit = profit.profit;
        this.peso = profit.peso;
        this.volumen = profit.volumen;
        this.valor = profit.valor;
        this.metromc = profit.metromc;
        this.metromcad = profit.metromcad;
      });
    },
  },
  computed: {
    opcionCalculadora: {
      get() {
        return this.$store.state.calculadoras.opcionCalculadora;
      },
      set(value) {
        this.$store.commit("setOpcion", value); // o una mutation/action de Vuex
      },
    },
    obtenerValoresProfitPorOpcion() {
      return this.$store.state.calculadoras.lstProfit.filter(
        (v) => v.opcion == this.opcionCalculadora
      );
    },
  },
};
</script>

<style></style>
