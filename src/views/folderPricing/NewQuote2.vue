<template>
  <v-container fluid class="pa-0" v-if="nuevoflag">
    <PreventUnload :when="hasChanges" />
    <v-card elevation="10">
      <v-stepper v-model="$store.state.pricing.tab" non-linear>
        <v-stepper-header>
          <v-stepper-step
            :complete="$store.state.pricing.tab > 1"
            step="1"
            :editable="editable1"
            v-if="cargaFlag"
          >
            Datos de la Carga
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="$store.state.pricing.tab > 2"
            step="2"
            :editable="editable2"
          >
            Costos de la Cotización
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :editable="editable3">
            Comparativa
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="4" :editable="editable4">
            Notas de Costos
          </v-stepper-step>
          <v-divider></v-divider>
          <!-- 
          <v-stepper-step step="4" :editable="editable4">
            Instructivo
          </v-stepper-step> -->
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="my-1">
              <v-col cols="12" lg="6" xl="6" class="pa-0" v-if="nuevoflag">
                <DatosPrincipales class="styleDatos" />
              </v-col>
              <v-col cols="12" lg="6" xl="6" class="pa-0" v-if="nuevoflag">
                <DatosCarga
                  class="styleDatos"
                  v-if="$store.state.pricing.step2"
                  id="carga"
                />
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12" v-if="nuevoflag">
                <Services v-if="$store.state.pricing.step3" id="servicio" />
              </v-col>
            </v-row>
            <v-row class="my-0" v-if="mostrarContinueServices()">
              <v-col align="right" class="my-0">
                <v-btn color="success" @click="changeStep({ step: 2 })">
                  CONTINUAR
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row class="my-1">
              <v-col cols="12" v-if="nuevoflag">
                <Costos />
              </v-col>
            </v-row>
            <v-col
              align="right"
              class="my-0"
              v-if="
                this.$store.state.pricing.costoflag &&
                this.$store.state.pricing.impuestoflag &&
                this.$store.state.pricing.ventaflag
              "
            >
              <v-btn color="success" @click="changeStep({ step: 3 })">
                CONTINUAR
              </v-btn>
            </v-col>
          </v-stepper-content>

          <v-stepper-content step="3">
            <Comparativa />
          </v-stepper-content>
          <v-stepper-content step="4">
            <Notas />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
    <v-dialog v-model="dialogRegistroQuote" persistent max-width="35%">
      <v-form ref="frmDatosNecesarios">
        <v-card class="pa-1">
          <v-card-title primary-title>
            <h2>Datos Importantes</h2>
          </v-card-title>
          <h4 class="ml-5">Lo puede llenar después.</h4>
          <v-card-actions>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Fecha Validez de la Cotización"
                  type="date"
                  v-model="$store.state.pricing.opcionCostos[0].date_end"
                  :error-messages="$store.state.pricing.errfecha_fin"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  type="number"
                  label="Tiempo en Tránsito"
                  v-model="$store.state.pricing.opcionCostos[0].tiempo_transito"
                  :error-messages="$store.state.pricing.errtiempo_transito"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-actions>
          <v-card-actions>
            <v-btn color="success" @click="guardar()">Continuar</v-btn>
            <v-btn
              color="warning"
              @click="dialogRegistroQuote = !dialogRegistroQuote"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialog" scrollable persistent max-width="80%">
      <v-card class="pa-2">
        <v-stepper v-model="stepImpuesto" vertical>
          <v-stepper-step step="1">
            Los impuestos de aduana son calculados sobre el Total del CIF
          </v-stepper-step>

          <!--  -->
          <v-stepper-content step="1">
            <v-card class="mb-12" min-height="200px">
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>FOB</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Flete de Venta</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Seguro de mercancía</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>TOTAL</td>
                    <td>CIF</td>
                    <td></td>
                    <td>
                      *Vendrá del monto de seguro de venta o calculado por 1%>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      *Está configuración quedará fija para próximos embarques,
                      se podrá editar en el módulo de configuración
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
            <v-btn color="primary" @click="stepImpuesto = 2"> Continue </v-btn>
            <v-btn text> Cancel </v-btn>
          </v-stepper-content>
          <!-- ---------------------------- -->
          <v-stepper-step step="2">
            Añadir conceptos de Impuestos
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-btn color="success" x-small class="my-1" @click="addRow()"
              >Añadir Impuesto</v-btn
            >
            <v-card min-height="200px">
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Impuesto</th>
                    <th>Porcentaje</th>
                    <th>Cálculo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in tableRows" :key="rowIndex">
                    <td>{{ row.nombre }}</td>
                    <td>
                      <div
                        v-for="(impuesto, index) in lstNuewImpuesto.slice(
                          0,
                          rowIndex + 1
                        )"
                        :key="index"
                      >
                        <input
                          type="checkbox"
                          v-model="row.checks[impuesto]"
                          :id="`check-${rowIndex}-${index}`"
                        />
                        <label :for="`check-${rowIndex}-${index}`">{{
                          impuesto
                        }}</label>
                      </div>
                    </td>
                    <!-- <td>{{ calcularPorcentaje(row) }}</td> -->
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
            <v-btn color="primary" @click="step = 2"> Continue </v-btn>
            <v-btn text> Cancel </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogConfig"
      persistent
      max-width="30%"
      transition="dialog-transition"
    >
      <v-card>
        <ConfigCotizacion />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mx-1" color="success" @click="guardarConfig()">
            Guardar
          </v-btn>
          <!-- <v-btn class="mx-1" color="error">Cancelar</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import Swal from "sweetalert2";
import moment from "moment";
import mixins from "@/components/mixins/funciones";
import PreventUnload from "vue-prevent-unload";
export default {
  mixins: [mixins],
  data() {
    return {
      tableRows: [],
      stepImpuesto: 1,
      dialog: false,
      hasChanges: true,
      editable1: true,
      editable2: false,
      editable3: false,
      editable4: false,
      cargaFlag: false,
      dialogRegistroQuote: false,
      nuevoflag: false,
      inactivarComparativa: true,
      mostrarSiguienteServiciosflag: true,
      dialogConfig: false,
      lstNuewImpuesto: ["CIF"],
    };
  },
  components: {
    PreventUnload,
    DatosPrincipales: () =>
      import(
        "@/components/folderPricing/InsertComponet/DatosPrincipalesComponent.vue"
      ),
    DatosCarga: () =>
      import(
        "@/components/folderPricing/InsertComponet/DatosCargaComponent.vue"
      ),
    Comparativa: () =>
      import(
        "@/components/folderPricing/InsertComponet/ComparativaComponent.vue"
      ),
    Services: () =>
      import("@/components/folderPricing/InsertComponet/ServicesComponent.vue"),
    Costos: () =>
      import(
        "@/components/folderPricing/InsertComponet/DatosCostosComponent.vue"
      ),
    Notas: () =>
      import("@/components/folderPricing/InsertComponet/NotasComponent.vue"),
    ConfigCotizacion: () =>
      import("@/components/folderPricing/ConfigCotizacion"),
  },

  async mounted() {
    await this.resetQuoteNew();

    this.$store.state.pricing.tab = 1;
    this.$store.state.pricing.index = 0;
    this.$store.state.pricing.totalFlete = 0;
    this.$store.state.pricing.totalVenta = 0;
    this.$store.state.pricing.totalCosto = 0;
    this.$store.state.mainTitle = `REGISTRO DE COTIZACIÓN`;
    this.$store.state.spiner = true;
    this.SET_QUOTE();
    await this.getMarketingList();
    await this.getQuoteStatus();
    await this.getModulesEntities();
    await this.getModality();
    await this.getShipment();
    await this.getIncoterms();
    await this.getModuleRole();
    // await this._getEntitiesCliente();
    await this._getRole();
    await this.getBegEndList();
    await this.cargarMasterDetallePercepcionAduana();
    await this.getPersonalPricing();
    this.cargaFlag = true;
    this.$store.state.spiner = false;
    this.$store.state.id_role_actual =
      this.$store.state.itemsDataRoleList.filter((v) => v.code == "9011")[0].id;
    this.nuevoflag = true;
    this.$store.state.pricing.costoflag = false;
    this.$store.state.pricing.impuestoflag = false;
    this.$store.state.pricing.ventaflag = false;
    this.$store.state.pricing.llenadoCostos = true;
    this.$store.state.drawer = false;
    this.$store.state.pricing.bloquearBtnImprimir = false;
    this.getCargarMasterDetalleNotasCotizacion();
    this.getImpuestos();
    this.cargarProveedores();
    this.obtenerImpuestoXEmpresa();
    let val = JSON.parse(sessionStorage.getItem("ConfigEmpresa"));
    this.dialogConfig = !val.existecot;
    // code: "4"
  },

  computed: {
    step2: {
      get() {
        return this.$store.state.pricing.step2;
      },
      set(val) {
        return (this.$store.state.pricing.step2 = step2);
      },
    },
    step3: {
      get() {
        return this.$store.state.pricing.step3;
      },
      set(val) {
        return (this.$store.state.pricing.step3 = step3);
      },
    },
    step4: {
      get() {
        return this.$store.state.pricing.step4;
      },
      set(val) {
        return (this.$store.state.pricing.step3 = step4);
      },
    },
  },
  methods: {
    ...mapActions([
      "getItemsServicesDetails",
      "getMarketingList",
      "getQuoteStatus",
      "getModulesEntities",
      "getModality",
      "getShipment",
      "getIncoterms",
      "getModuleRole",
      "getCargarMasterDetalleNotasCotizacion",
      "_getEntitiesCliente",
      "_getRole",
      "getImpuestos",
      "registrarQuote",
      "crearCarpetaOneDrive",
      "actualizarURLEnElQuote",
      "getBegEndList",
      "cargarMasterDetallePercepcionAduana",
      "getMultiplicador",
      "cargarProveedores",
      "getPersonalPricing",
      "getTipoCostos",
      "resetQuoteNew",
      "obtenerImpuestoXEmpresa",
      "GuardarConfiguracionEmpresa",
      "ObtenerDatosConfig",
    ]),
    ...mapMutations(["SET_QUOTE"]),
    async guardarConfig() {
      await this.GuardarConfiguracionEmpresa();
      await this.ObtenerDatosConfig();
      this.dialogConfig = false;
    },
    mostrarContinueServices() {
      return (
        // this.mostrarSiguienteServiciosflag &&
        this.$store.state.pricing.step3
      );
    },
    mostrarComparativa() {
      return this.$store.state.pricing.opcionCostos.length > 0;
    },
    disabledComparativa() {
      return true;
    },
    async changeStep({ step = 1 }) {
      switch (step) {
        case 2:
          // cargar los costos
          let validate = true;
          if (
            this.validaCostos() &&
            !this.$store.state.pricing.datosPrincipales.amount
          ) {
            this.$store.state.pricing.errorValorMercancia = "Dato Requerido";
            validate = false;
          }
          if (!!validate) {
            this.$store.state.spiner = true;
            await this.getMultiplicador();
            await this.getTipoCostos();
            await this.getItemsServicesDetails();
            this.$store.state.pricing.opcionCostos = [
              {
                nro_propuesta: 1,
                date_end: "",
                tiempo_transito: 0,
                listCostos: [],
                listImpuestos: [],
                listNotasQuote: [],
                selected: false,
              },
            ];
            let nro_propuesta = 1;
            this.$store.state.pricing.opcionCostos[0].listCostos =
              this.$store.state.pricing.listCostos.map((objeto) => ({
                ...objeto,
                nro_propuesta,
              }));
            this.$store.state.pricing.opcionCostos[0].listImpuestos =
              this.$store.state.pricing.listImpuestos.map((objeto) => ({
                ...objeto,
                nro_propuesta,
              }));
            this.$store.state.pricing.opcionCostos[0].listNotasQuote =
              this.$store.state.pricing.listNotasQuote.map((objeto) => ({
                ...objeto,
                nro_propuesta,
              }));
            this.irSegundoStep();

            this.mostrarSiguienteServiciosflag = false;
          }
          break;
        case 3:
          // cargar las notas
          this.irTerceStep();
        case 4:
          // cargar instructivo
          this.editable4 = true;
          break;

        default:
          break;
      }
    },
    validaCostos() {
      let code = [2, 6, 15];
      let existeMonto = this.$store.state.pricing.listServices.some(
        (v) => code.includes(v.codegroupservices) && v.status == true
      );
      return existeMonto;
    },
    isDateValid(date) {
      if (!date) {
        return true; // Pasa la validación si el campo está vacío
      }

      const selectedDate = moment(date, "YYYY-MM-DD", true);
      const today = moment();

      return selectedDate.isAfter(today);
    },
    async irSegundoStep() {
      Swal.fire({
        icon: "question",
        title: "Cotizar",
        html: "<b>¿Desea pasar a Cotizar?<b>",
        showConfirmButton: true,
        confirmButtonText: "Pasar a Cotizar",
        confirmButtonColor: "green",
        showDenyButton: true,
        denyButtonText: "Guardar borrador",
        allowEnterKey: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.state.pricing.opcionCostos = [
            {
              nro_propuesta: 1,
              date_end: "",
              tiempo_transito: 0,
              listCostos: [],
              listImpuestos: [],
              listNotasQuote: [],
              selected: false,
            },
          ];
          let nro_propuesta = 1;
          this.$store.state.pricing.opcionCostos[0].listCostos =
            this.$store.state.pricing.listCostos.map((objeto) => ({
              ...objeto,
              nro_propuesta,
            }));
          this.$store.state.pricing.opcionCostos[0].listImpuestos =
            this.$store.state.pricing.listImpuestos.map((objeto) => ({
              ...objeto,
              nro_propuesta,
            }));
          this.$store.state.pricing.opcionCostos[0].listNotasQuote =
            this.$store.state.pricing.listNotasQuote.map((objeto) => ({
              ...objeto,
              nro_propuesta,
            }));
          this.$store.state.pricing.reset = !this.$store.state.pricing.reset;
          this.$store.state.pricing.tab = 2;
          this.$store.state.spiner = false;
          this.editable2 = true;
          this.$store.state.pricing.btnRegistrar = true;
        }
        if (result.isDenied) {
          await this.guardar();
        }
      });
      // this.$store.state.pricing.tab = step;
      // this.editable2 = true;
    },
    async guardar() {
      this.$store.state.spiner = true;
      this.$store.state.pricing.opcionCostos[0].selected = true;
      await this.registrarQuote({ fullflag: false }).catch((err) => {
        console.log("registrarQuote", err);
      });
      if (this.$store.state.pricing.nro_quote) {
        this.$store.state.spiner = false;
        let vm = this;

        Swal.fire({
          icon: "success",
          title: "Aviso",
          text: vm.$store.state.pricing.mensaje,
          confirmButtonText: "Ir al listado",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            vm.$router.push({
              name: "lstQuote",
            });
          }
          if (result.isDismissed) {
            vm.$router.push({
              name: "lstQuote",
            });
          }
        });
        let id_branch = JSON.parse(sessionStorage.getItem("dataUser"))[0]
          .id_branch;
        let branchCreacion = [1, 2];
        if (branchCreacion.includes(id_branch)) {
          await this.crearCarpetaOneDrive({
            nro_quote: this.$store.state.pricing.nro_quote,
            nombre: this.$store.state.pricing.datosPrincipales.nombre,
          }).catch((err) => {
            console.log("crearCarpetaOneDrive", err);
          });

          await this.actualizarURLEnElQuote({
            id: this.$store.state.pricing.id,
            url: this.$store.state.pricing.urlFolder,
          }).catch((err) => {
            console.log("actualizarURLEnElQuote", err);
          });
        }
      }
    },
    irTerceStep() {
      let validate = true;
      let validacionCostos;
      validacionCostos = this.validateCost({
        costo: this.$store.state.pricing.listCostos.filter(
          (v) => v.esopcionflag == 1
        ),
        multiplicador: this.$store.state.pricing.listMultiplicador,
        services: this.$store.state.pricing.listServices,
      });
      validate = validacionCostos.estado;
      if (!validacionCostos.estado) {
        Swal.fire({
          icon: "warning",
          title: "Aviso",
          text: validacionCostos.mensaje,
        });
      }
      this.$store.state.pricing.errfecha_fin = "";
      this.$store.state.pricing.errtiempo_transito = "";
      if (!this.$store.state.pricing.datosPrincipales.fecha_fin) {
        this.$store.state.pricing.errfecha_fin = "Dato Requerido";
        validate = false;
      } else {
        let hoy = moment().format("YYYYMMDD");
        let fecha = moment(
          this.$store.state.pricing.datosPrincipales.fecha_fin
        ).format("YYYYMMDD");
        if (parseInt(hoy) >= parseInt(fecha)) {
          this.$store.state.pricing.errfecha_fin =
            "La fecha debe ser mayor que la fecha actual";
          validate = false;
        }
      }
      if (!this.$store.state.pricing.datosPrincipales.tiempo_transito) {
        this.$store.state.pricing.errtiempo_transito =
          "El Tiempo de transito es requerido";
        validate = false;
      }
      if (validate == true) {
        this.editable3 = true;
        this.$store.state.pricing.tab = 3;
      }
    },
    addRow() {
      const newRow = {
        nombre: `Fila ${this.tableRows.length + 1}`, // Nombre dinámico para cada fila
        // checks: this.lstImpuesto.reduce((acc, impuesto) => {
        //   acc[impuesto] = false;
        //   return acc;
        // }, {}),
      };
      this.tableRows.push(newRow);
    },
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.pricing.tab;
      },
      set(val) {
        return (this.$store.state.pricing.tab = tab);
      },
    },
    listImpuestos: {
      get() {
        return this.$store.state.pricing.listImpuestos;
      },
      set(val) {
        return (this.$store.state.pricing.listImpuestos = listImpuestos);
      },
    },
  },
  watch: {
    "$store.state.pricing.step2"() {
      setTimeout(() => {
        const element = document.getElementById("carga");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    "$store.state.pricing.step3"() {
      setTimeout(() => {
        const element = document.getElementById("servicio");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    tab() {
      if (this.tab == 2) {
        this.editable1 = true;
        this.editable2 = true;
        this.editable3 = false;
      }
      if (this.tab == 3) {
        this.editable1 = false;
        this.editable2 = false;
        this.editable4 = false;
      }

      if (this.tab == 4) {
        this.editable1 = true;
        this.editable2 = true;
        this.editable3 = false;
        this.editable4 = true;
      }
    },
  },
};
</script>

<style scoped>
.perdida {
  background: red !important;
  color: white !important;
}
.ganancia {
  background: green !important;
  color: white !important;
}
.v-stepper v-stepper--is-booted v-stepper--non-linear v-sheet theme--light {
  color: white !important;
}
.monto {
  font-size: 1.5rem;
}
.styleDatos {
  min-height: 60vh;
}
.nuevoImp {
  border-left: 2px solid black;
}
</style>
