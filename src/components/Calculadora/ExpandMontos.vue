<template>
  <v-container>
    <v-expansion-panels accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>{{ tipo.nombre }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <thead>
              <tr>
                <th>Multiplicador</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Monto Mínimo</th>
                <th>Fecha Validez</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(Monto, index) in lstMontos" :key="index">
                <td>
                  <v-autocomplete
                    dense
                    :items="$store.state.calculadoras.lstMultiplicador"
                    item-value="id"
                    item-text="name"
                    :rules="[(v) => !!v || 'Dato Requerido']"
                    v-model="Monto.id_multiplicador"
                    hide-details
                    :disabled="Monto.bloqueadoflag"
                  />
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    v-model="Monto.concepto"
                    :disabled="Monto.bloqueadoflag"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    type="number"
                    v-model="Monto.punitario"
                    :disabled="Monto.bloqueadoflag"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    v-model="Monto.costominimo"
                    :disabled="Monto.bloqueadoflag"
                    type="number"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    v-model="Monto.fechavalidez"
                    type="date"
                    :disabled="Monto.bloqueadoflag"
                  ></v-text-field>
                </td>
                <td>
                  <v-btn
                    v-if="Monto.bloqueadoflag"
                    icon
                    small
                    color="info"
                    @click="Monto.bloqueadoflag = false"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    small
                    color="warning"
                    v-else
                    @click="actualizarCosto(Monto)"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                  <v-btn icon small color="error" @click="elimimarCosto(Monto)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";
export default {
  props: {
    lstMontos: {
      type: Array,
      default: () => [],
    },
    tipo: {
      type: Object,
      default: {},
    },
  },
  methods: {
    ...mapActions(["ActualizarCosto", "EliminarCosto"]),
    actualizarCosto(costo) {
      this.ActualizarCosto(costo);
    },
    elimimarCosto(costo) {
      Swal.fire({
        icon: "error",
        title: "Eliminar",
        text: "Desea Eliminar Registro.",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, Eliminar",
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((res) => {
        if (res.isConfirmed) {
          this.EliminarCosto(costo);
        }
      });
    },
  },
};
</script>

<style scoped></style>
