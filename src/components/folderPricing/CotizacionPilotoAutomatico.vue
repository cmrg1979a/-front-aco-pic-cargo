<template>
  <v-container>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1"> Fechas: </v-stepper-step>

      <v-stepper-content step="1">
        <v-form ref="frmFecha">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="
                  $store.state.pricing.opcionCostos[$store.state.pricing.index]
                    .date_end
                "
                type="date"
                label="`Fecha Validez de la cotización`"
                :rules="[
                  (v) => !!v || 'Dato Requerido',
                  (v) => isDateValid(v) || 'La fecha debe ser mayor que hoy.',
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="
                  $store.state.pricing.opcionCostos[$store.state.pricing.index]
                    .tiempo_transito
                "
                type="number"
                label="`Tiempo en tránsito de la Opción`"
                :rules="[
                  (v) => !!v || 'Dato Requerido',
                  (v) => v > 0 || 'El valor tiene que ser positivo.',
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn small class="mx-1" color="primary" @click="continuar(2)">
                Continue
              </v-btn>
              <v-btn small class="mx-1" color="error" @click="cancelar">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">
        Costos Requerido:
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn small class="mx-1" color="primary" @click="continuar(3)">
          Continue
        </v-btn>
        <v-btn small class="mx-1" color="error" @click="cancelar">
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">
        Profit Estimado
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="profit"
              type="numer"
              step="0.01"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" @click="continuar(4)"> Continue </v-btn>
            <v-btn small class="mx-1" color="error" @click="cancelar">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>

      <!-- <v-stepper-step step="4"> View setup instructions </v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 1"> Continue </v-btn>
        <v-btn small class="mx-1" color="error" @click="cancelar">
          Cancel
        </v-btn>
      </v-stepper-content>-->
    </v-stepper>
  </v-container>
</template>

<script>
import moment from "moment";
import mixins from "@/components/mixins/funciones.js";
export default {
  mixins: [mixins],
  mounted() {
    this.$nextTick(() => {
      this.e6 = 1;
    });
  },
  data() {
    return {
      e6: 1,
      profit: 0,
      resumenOpcion: {
        flete: 0,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      },
      resumenOpcionVentas: {
        flete: 0,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      },
      valores: this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.filter((v) => v.esopcionflag == 1),
      valoresVentas: this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.filter((v) => v.esventaflag == 1),
    };
  },
  methods: {
    isDateValid(date) {
      if (!date) {
        return true; // Pasa la validación si el campo está vacío
      }

      const selectedDate = moment(date, "YYYY-MM-DD", true);
      const today = moment();

      return selectedDate.isAfter(today);
    },
    continuar(step) {
      if (step == 1 && !this.$refs.frmFecha.validate()) {
        return;
      }
      if (step === 4) {
        this.calcTotales();
        this.calcTotalesVentas();

        const { pricing } = this.$store.state;
        const opcionActual = pricing.opcionCostos[pricing.index];

        // 1. Validación de seguridad para idEmbarque
        const multiplicador = pricing.listMultiplicador.find(
          (v) => v.code == 1,
        );
        if (!multiplicador) {
          console.error("No se encontró el multiplicador con código 1");
          return;
        }
        const idEmbarque = multiplicador.id;

        // 2. Cálculo de monto
        let montoFinal =
          Number(this.profit) + Number(this.$store.state.pricing.totalCosto);

        // 3. Buscar el costo del flete
        const ventas = opcionActual.listCostos.filter(
          (v) => v.esventaflag == 1,
        );
        const costoFlete = ventas.find((v) => v.id_multiplicador == idEmbarque);

        if (costoFlete) {
          costoFlete.costounitario = montoFinal;

          console.log("Costo flete actualizado:", montoFinal);
        }
      }
      this.e6 = step;
    },
    cancelar() {
      this.e6--;
    },
    async calcTotales() {
      Promise.all([
        this.calcularTotalesFlete(),
        this.calcularTotalesNoFlete(),
      ]).then(() => {
        this.calcTotal();
      });
    },

    calcularTotalesFlete() {
      this.totalOption = 0;
      this.resumenOpcion = {
        flete: 0,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      };

      if (this.isFlete) {
        this.valores
          .filter(
            (v) => v.esfleteflag == 1 && v.status == 1 && v.esopcionflag == 1,
          )
          .forEach((element) => {
            if (this.isNotPorcentaje(element, element.id_multiplicador)) {
              this.resumenOpcion.flete +=
                (this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador,
                ).length > 0
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    )[0].valor
                  : 0) *
                element.costounitario *
                this.calcularFac(
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "N",
                  this.$store.state.pricing.datosPrincipales.volumen,
                  this.$store.state.pricing.datosPrincipales.peso,
                  this.$store.state.pricing.datosPrincipales.containers,
                  this.$store.state.pricing.datosPrincipales.amount,
                );
            } else {
              this.resumenOpcion.flete += this.calcularValor(
                this.$store.state.pricing.datosPrincipales.amount,
                this.$store.state.pricing.totalFlete,
                this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador,
                ).length > 0
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    )[0].code
                  : "",
                this.$store.state.pricing.listMultiplicador.some(
                  (v) =>
                    v.id == element.id_multiplicador &&
                    (v.code == 14 ||
                      v.code == 13 ||
                      v.code == 15 ||
                      v.code == 5),
                )
                  ? this.$store.state.pricing.listMultiplicador.some(
                      (v) =>
                        v.id == element.id_multiplicador &&
                        (v.code == 14 ||
                          v.code == 13 ||
                          v.code == 15 ||
                          v.code == 5),
                    )
                    ? element.cif
                    : element.seguro
                  : 0,
              );
            }
          });
      }
    },
    calcularTotalesNoFlete() {
      this.resumenOpcion = {
        flete: this.resumenOpcion.flete,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      };
      this.valores
        .filter((v) => v.status == 1)
        .forEach((element) => {
          //   GASTOS
          if (this.isOrigen) {
            if (element.esorigenflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.origen +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcion.origen += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          if (this.isLocal) {
            if (element.eslocalflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.gasto +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcion.gasto += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          //   ADUANA
          if (this.isAduana) {
            if (element.esaduanaflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.aduana +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcion.aduana += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          //   ALMACEN
          if (this.isAlmacen) {
            if (element.esalmacenflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.almacen +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcion.almacen += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          //   GASTOS DE TERCEROS
          if (this.isGastosTercero) {
            if (element.esgastostercerosflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcion.gastostercero +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcion.gastostercero += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
        });
    },
    calcTotal() {
      this.totalOption = 0;
      this.totalOption =
        this.resumenOpcion.flete +
        this.resumenOpcion.gasto +
        this.resumenOpcion.aduana +
        this.resumenOpcion.origen +
        this.resumenOpcion.almacen +
        this.resumenOpcion.gastostercero;

      this.$store.state.pricing.totalCosto = this.totalOption;
      // this.setTotalOpcion(valores);
    },

    async calcTotalesVentas() {
      Promise.all([
        this.calcularTotalesFleteVentas(),
        this.calcularTotalesNoFleteVentas(),
      ]).then(() => {
        this.calcTotalVentas();
      });
    },

    calcularTotalesFleteVentas() {
      this.totalOption = 0;
      this.resumenOpcionVentas = {
        flete: 0,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      };

      if (this.isFlete) {
        this.valores
          .filter(
            (v) => v.esfleteflag == 1 && v.status == 1 && v.esopcionflag == 1,
          )
          .forEach((element) => {
            if (this.isNotPorcentaje(element, element.id_multiplicador)) {
              this.resumenOpcionVentas.flete +=
                (this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador,
                ).length > 0
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    )[0].valor
                  : 0) *
                element.costounitario *
                this.calcularFac(
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "N",
                  this.$store.state.pricing.datosPrincipales.volumen,
                  this.$store.state.pricing.datosPrincipales.peso,
                  this.$store.state.pricing.datosPrincipales.containers,
                  this.$store.state.pricing.datosPrincipales.amount,
                );
            } else {
              this.resumenOpcionVentas.flete += this.calcularValor(
                this.$store.state.pricing.datosPrincipales.amount,
                this.$store.state.pricing.totalFlete,
                this.$store.state.pricing.listMultiplicador.filter(
                  (v) => v.id == element.id_multiplicador,
                ).length > 0
                  ? this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    )[0].code
                  : "",
                this.$store.state.pricing.listMultiplicador.some(
                  (v) =>
                    v.id == element.id_multiplicador &&
                    (v.code == 14 ||
                      v.code == 13 ||
                      v.code == 15 ||
                      v.code == 5),
                )
                  ? this.$store.state.pricing.listMultiplicador.some(
                      (v) =>
                        v.id == element.id_multiplicador &&
                        (v.code == 14 ||
                          v.code == 13 ||
                          v.code == 15 ||
                          v.code == 5),
                    )
                    ? element.cif
                    : element.seguro
                  : 0,
              );
            }
          });
      }
    },
    calcularTotalesNoFleteVentas() {
      this.resumenOpcionVentas = {
        flete: this.resumenOpcionVentas.flete,
        origen: 0,
        gasto: 0,
        aduana: 0,
        almacen: 0,
        gastostercero: 0,
      };
      this.valores
        .filter((v) => v.status == 1)
        .forEach((element) => {
          //   GASTOS
          if (this.isOrigen) {
            if (element.esorigenflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcionVentas.origen +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcionVentas.origen += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          if (this.isLocal) {
            if (element.eslocalflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcionVentas.gasto +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcionVentas.gasto += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          //   ADUANA
          if (this.isAduana) {
            if (element.esaduanaflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcionVentas.aduana +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcionVentas.aduana += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          //   ALMACEN
          if (this.isAlmacen) {
            if (element.esalmacenflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcionVentas.almacen +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcionVentas.almacen += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
          //   GASTOS DE TERCEROS
          if (this.isGastosTercero) {
            if (element.esgastostercerosflag == 1) {
              if (this.isNotPorcentaje(element, element.id_multiplicador)) {
                this.resumenOpcionVentas.gastostercero +=
                  (this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].valor
                    : 0) *
                  element.costounitario *
                  this.calcularFac(
                    this.$store.state.pricing.listMultiplicador.filter(
                      (v) => v.id == element.id_multiplicador,
                    ).length > 0
                      ? this.$store.state.pricing.listMultiplicador.filter(
                          (v) => v.id == element.id_multiplicador,
                        )[0].code
                      : "N",
                    this.$store.state.pricing.datosPrincipales.volumen,
                    this.$store.state.pricing.datosPrincipales.peso,
                    this.$store.state.pricing.datosPrincipales.containers,
                    this.$store.state.pricing.datosPrincipales.amount,
                  );
              } else {
                this.resumenOpcionVentas.gastostercero += this.calcularValor(
                  this.$store.state.pricing.datosPrincipales.amount,
                  this.$store.state.pricing.totalFlete,
                  this.$store.state.pricing.listMultiplicador.filter(
                    (v) => v.id == element.id_multiplicador,
                  ).length > 0
                    ? this.$store.state.pricing.listMultiplicador.filter(
                        (v) => v.id == element.id_multiplicador,
                      )[0].code
                    : "",
                  this.$store.state.pricing.listMultiplicador.some(
                    (v) =>
                      v.id == element.id_multiplicador &&
                      (v.code == 14 ||
                        v.code == 13 ||
                        v.code == 15 ||
                        v.code == 5),
                  )
                    ? this.$store.state.pricing.listMultiplicador.some(
                        (v) =>
                          v.id == element.id_multiplicador &&
                          (v.code == 14 ||
                            v.code == 13 ||
                            v.code == 15 ||
                            v.code == 5),
                      )
                      ? element.cif
                      : element.seguro
                    : 0,
                );
              }
            }
          }
        });
    },
    calcTotalVentas() {
      this.totalOption = 0;
      this.totalOption =
        this.resumenOpcionVentas.flete +
        this.resumenOpcionVentas.gasto +
        this.resumenOpcionVentas.aduana +
        this.resumenOpcionVentas.origen +
        this.resumenOpcionVentas.almacen +
        this.resumenOpcionVentas.gastostercero;

      this.$store.state.pricing.totalVenta = this.totalOption;
      // this.setTotalOpcion(valores);
    },
    isNotPorcentaje(element, id_multiplicador) {
      let code = [5, 13, 14, 15];

      let mul = this.$store.state.pricing.listMultiplicador.some(
        (v) => v.id == id_multiplicador && code.includes(v.code),
      );

      return !mul;
    },
  },
  computed: {
    isFlete() {
      return this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.some((v) => v.esfleteflag == 1 && v.status == 1);
    },
    isOrigen() {
      return this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.some((v) => v.esorigenflag == 1 && v.status == 1);
    },
    isLocal() {
      return this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.some((v) => v.eslocalflag == 1 && v.status == 1);
    },
    isAduana() {
      return this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.some((v) => v.esaduanaflag == 1 && v.status == 1);
    },
    isAlmacen() {
      return this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.some((v) => v.esalmacenflag == 1 && v.status == 1);
    },
    isGastosTercero() {
      return this.$store.state.pricing.opcionCostos[
        this.$store.state.pricing.index
      ].listCostos.some((v) => v.esgastostercerosflag == 1 && v.status == 1);
    },
  },
};
</script>

<style></style>
