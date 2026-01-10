<template>
  <v-card fluid v-if="this.opcionesSeleccionadas.length > 0">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="30%"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Registro de nueva nota - Opción
          {{ opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta
          }}<v-spacer></v-spacer>
          <v-btn icon color="default" @click="dialog = !dialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="frmNota">
            <v-text-field
              label="Descripción Nota Nueva"
              v-model="descripcion"
              id="id"
              :rules="[(v) => !!v || 'Dato requerido']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="anidarNota" color="success">Agregar Nueva nota</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        Añadir nueva Nota: Opción
        {{ opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta }}
        <v-btn icon color="primary" @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" class="derecha">
        <template>
          <div class="text-center">
            <v-pagination
              v-model="$store.state.pricing.page"
              :length="opcionesSeleccionadas.length"
              circle
            ></v-pagination>
          </div>
        </template>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels class="my-1 condensed" hover>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Notas Principales
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="
                  opcionesSeleccionadas[
                    $store.state.pricing.page - 1
                  ].listNotasQuote.filter((v) => v.estado == 1)
                "
                hide-default-footer
                dense
                disable-sort
                :items-per-page="-1"
              >
                <template v-slot:item="row">
                  <tr>
                    <td class="indexTblClass">{{ row.index + 1 }}</td>
                    <td class="btnDescriptionClass">
                      <v-textarea
                        v-model="row.item.descripcion"
                        hide-details
                        dense
                        rows="1"
                        auto-grow
                      ></v-textarea>
                    </td>
                    <td class="btnTblClass">
                      <v-btn
                        icon
                        color="red"
                        x-small
                        @click="row.item.estado = 0"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels class="my-1 condensed" hover>
          <v-expansion-panel>
            <v-expansion-panel-header> Se incluye </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="
                  $store.state.pricing.listServices.filter((v) => v.status == 1)
                "
                hide-default-footer
                dense
                :items-per-page="-1"
                disable-sort
              >
                <template v-slot:item="row">
                  <tr>
                    <td class="indexTblClass">{{ row.index + 1 }}</td>

                    <td class="btnDescriptionClass">
                      <v-textarea
                        v-model="row.item.namegroupservice"
                        readonly
                        hide-details
                        dense
                        rows="1"
                        auto-grow
                      ></v-textarea>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-expansion-panels class="my-1 condensed" hover>
        <v-expansion-panel>
          <v-expansion-panel-header> No se incluye </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="headers"
              :items="
                $store.state.pricing.listServices.filter((v) => v.status == 0)
              "
              hide-default-footer
              dense
              :items-per-page="-1"
              disable-sort
            >
              <template v-slot:item="row">
                <tr>
                  <td class="indexTblClass">{{ row.index + 1 }}</td>

                  <td class="btnDescriptionClass">
                    <v-textarea
                      v-model="row.item.namegroupservice"
                      readonly
                      hide-details
                      dense
                      rows="1"
                      auto-grow
                    ></v-textarea>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-col class="derecha">
        <v-btn color="#3363A2" dark @click="abrirModalCambioNombreSecciones()">
          PREVIEW COTIZACIÓN(es)</v-btn
        >
      </v-col>
      <!-- <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="info"
        class="mx-1"
        small
        @click="abrirModalTipoReportePreview()"
      >
        Preview Cotizacion
      </v-btn>
    </v-card-actions> -->
    </v-row>
    <v-dialog
      v-model="dialogCambioNombreSecciones"
      scrollable
      persistent
      width="50%"
    >
      <v-card>
        <v-card-title> Secciones de los costos </v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tipocosto, index) in $store.state.pricing.namesection"
                :key="index"
              >
                <td>{{ tipocosto.codigo }}</td>
                <td>
                  <v-text-field v-model="tipocosto.name"></v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="mx-1"
            @click="abrirModalTipoReportePreview()"
            color="success"
            >Aceptar</v-btn
          >
          <v-btn
            class="mx-1"
            @click="dialogCambioNombreSecciones = !dialogCambioNombreSecciones"
            color="warning"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="imprimirFlag" max-width="40%" v-if="imprimirFlag">
      <v-card color="" class="py-5">
        <v-card-title primary-title>
          SELECCIÓN DE TIPO DE REPORTE A IMPRIMIR
        </v-card-title>
        <v-card-text>
          <v-form ref="frmReporte">
            <v-radio-group
              v-model="tiporeporte"
              disabled
              column
              :rules="[(v) => !!v || 'Dato requerido']"
            >
              <v-radio
                label="Costo detallado por cada item"
                color="red darken-3"
                value="DETALLE"
              ></v-radio>

              <v-radio
                label="Totales por servicios"
                color="indigo darken-3"
                value="TOTAL"
              ></v-radio>

              <v-radio
                label="Reporte total general sin desglose"
                color="orange darken-3"
                value="AGRUPADO"
              ></v-radio>
            </v-radio-group>

            <v-divider class="my-4"></v-divider>

            <v-switch
              v-model="cambiarStatus"
              label="¿Desea cambiar el estatus de la cotización?"
              inset
            ></v-switch>

            <v-slide-y-transition>
              <div v-if="cambiarStatus">
                <v-select
                  v-model="selectedStatusId"
                  :items="$store.state.pricing.listQuoteStatus"
                  item-text="name"
                  item-value="id"
                  label="Nuevo estatus de la cotización"
                  dense
                  outlined
                ></v-select>
              </div>
            </v-slide-y-transition>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="loading" text @click="generar">
            Aceptar
          </v-btn>
          <v-btn color="red" text @click="imprimirFlag = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="previewFlag" max-width="40%" v-if="previewFlag">
      <v-card color="" class="py-5">
        <v-card-title primary-title>
          SELECCIÓN DE TIPO DE REPORTE PARA LA PREVISUALIZACIÓN
        </v-card-title>
        <v-card-text>
          <v-form ref="frmReporte">
            <v-radio-group
              v-model="tiporeporte"
              column
              :rules="[(v) => !!v || 'Dato requerido']"
            >
              <v-radio
                label="Costo detallado por cada item"
                color="red darken-3"
                value="DETALLE"
              ></v-radio>

              <v-radio
                label="Totales por servicios"
                color="indigo darken-3"
                value="TOTAL"
              ></v-radio>

              <v-radio
                label="Reporte total general sin desglose"
                color="orange darken-3"
                value="AGRUPADO"
              ></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="generarPreview"> Aceptar </v-btn>
          <v-btn color="red" text @click="previewFlag = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPreview"
      scrollable
      persistent
      max-width="80%"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="indigo white--text my-0 py-0" dark>
          PREVISUALIZACIÓN DE LA COTIZACIÓN - NO TIENE NINGÚN VALOR COMERCIAL

          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="dialogPreview = !dialogPreview">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <previewCotizacion
            :data="predataCotizacion"
            v-on:cerrar="dialogPreview = $event"
            :index="pagePrev"
          />
        </v-card-text>
        <v-card-actions>
          <template>
            <div class="text-center">
              <v-pagination
                v-model="pagePrev"
                :length="opcionesSeleccionadas.length"
                circle
              ></v-pagination>
            </div>
          </template>

          <v-spacer></v-spacer>
          <v-btn
            color="#A43542"
            class="mx-1"
            style="color: white !important"
            small
            :disabled="$store.state.pricing.bloquearBtnImprimir"
            @click="abrirModalTipoReporte()"
          >
            Imprimir Cotizacion
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    previewCotizacion: () =>
      import("@/components/folderPricing/previewQuote.vue"),
  },
  data() {
    return {
      opcionesSeleccionadas: [{ listNotasQuote: [] }],
      dialog: false,
      headers: [
        { value: "index", text: "#" },
        { value: "description", text: "Descripción", align: "center" },
      ],

      pagePrev: 1,
      tiporeporte: "",
      descripcion: "",
      predataCotizacion: null,
      dialogPreview: false,
      previewFlag: false,
      imprimirFlag: false,
      loading: false,
      dialogCambioNombreSecciones: false,
      cambiarStatus: false,
      selectedStatusId: null,
    };
  },
  mounted() {
    this.dialog = false;
    if (
      (this.opcionesSeleccionadas = this.$store.state.pricing.opcionCostos.some(
        (v) => !!v.selected
      ))
    ) {
      this.opcionesSeleccionadas =
        this.$store.state.pricing.opcionCostos.filter((v) => !!v.selected);
    }
  },
  methods: {
    ...mapActions([
      "registrarQuote",
      "getQuote",
      "obtenerDatosEmpresa",
      "generarReporte",
      "crearCarpetaOneDrive",
      "actualizarURLEnElQuote",
      "predata",
    ]),
    llenarNotasSeleccionadas() {
      this.opcionesSeleccionadas =
        this.$store.state.pricing.opcionCostos.filter((v) => !!v.selected);
    },
    abrirModalTipoReporte() {
      this.tiporeporte = "";
      this.dialogPreview = false;

      this.previewFlag = true;
    },
    abrirModalCambioNombreSecciones() {
      Swal.fire({
        icon: "question",
        width: 1000,
        html: "<h1> ¿Desea cambiar el nombre de la secciones?. Recuerde que  este cambio se verá reflejado solo en la cotización(pdf) </h1>",
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "<h1>Si cambiar</h1>",
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: "<h1>No cambiar<h1>",
        denyButtonText: "<h1>Cerrar<h1>",
      }).then((accion) => {
        if (accion.isConfirmed) {
          this.dialogCambioNombreSecciones = true;
        }
        if (accion.isDismissed) {
          this.abrirModalTipoReportePreview();
        }
      });
    },
    anidarNota() {
      if (this.$refs.frmNota.validate()) {
        this.opcionesSeleccionadas[
          this.$store.state.pricing.page - 1
        ].listNotasQuote.push({
          descripcion: this.descripcion,
          estado: 1,
        });
      }
      setTimeout(() => {
        this.descripcion = "";
        this.$refs.frmNota.resetValidation();
      }, 10);
      this.dialog = !this.dialog;
    },

    async generar() {
      this.$store.state.pricing.tiporeporte = this.tiporeporte;
      this.loading = true;
      if (this.$refs.frmReporte.validate()) {
        this.$store.state.spiner = true;
        await this.registrarQuote({ fullflag: true }).catch((e) => {
          console.log(e);
        });
        if (this.$store.state.pricing.nro_quote) {
          this.$store.state.spiner = false;
          let vm = this;
          await this.obtenerDatosEmpresa().catch((e) => {
            console.log(e);
          });

          for (
            let index = 0;
            index < this.$store.state.pricing.opcionCostos.length;
            index++
          ) {
            if (
              this.$store.state.pricing.opcionCostos[index].selected == true
            ) {
              await this.generarReporte({
                tipo: this.tiporeporte,
                nro_propuesta:
                  this.$store.state.pricing.opcionCostos[index].nro_propuesta,
              }).catch((e) => {
                console.log(e);
              });
            }
          }
          this.loadingTable = false;
          this.loading = false;
          this.$store.state.spiner = false;
          let id_branch = JSON.parse(sessionStorage.getItem("dataUser"))[0]
            .id_branch;
          let branchCreacion = [1, 2];
          if (branchCreacion.includes(id_branch)) {
            this.crearCarpetaOneDrive({
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
          this.$router.push({
            name: "verQuote",
            params: {
              id: this.$store.state.pricing.id,
            },
          });
        }
      }
    },
    abrirModalTipoReporte() {
      this.imprimirFlag = true;
    },
    abrirModalTipoReportePreview() {
      this.tiporeporte = "";
      this.previewFlag = true;
      this.dialogCambioNombreSecciones = false;
      this.$store.state.pricing.bloquearBtnImprimir = false;
      const list = this.$store.state.pricing.listQuoteStatus || [];
      const estatusDefault = list.find(
        (estatus) =>
          estatus.defaultstatus === 1 ||
          estatus.defaultstatus === "1" ||
          estatus.defaultstatus === true
      );

      if (estatusDefault) {
        this.selectedStatusId = estatusDefault.id;
      } else if (list.length > 0) {
        this.selectedStatusId = list[0].id;
      } else {
        this.selectedStatusId = null;
      }
      this.cambiarStatus = false;
    },
    async generarPreview() {
      if (this.$refs.frmReporte.validate()) {
        this.$store.state.spiner = true;
        this.previewFlag = false;
        if (this.cambiarStatus && this.selectedStatusId) {
          this.$store.state.pricing.datosPrincipales.id_status =
            this.selectedStatusId;
        }
        await this.obtenerDatosEmpresa();
        this.predataCotizacion = await this.predata({
          tipo: this.tiporeporte,
        });
        this.$store.state.spiner = false;
        this.dialogPreview = true;
      }
    },
  },
  computed: {
    actualizarNotas: {
      get() {
        return this.$store.state.pricing.actualizarNotas;
      },
      set(val) {
        return (this.$store.state.pricing.actualizarNotas = actualizarNotas);
      },
    },
  },
  watch: {
    actualizarNotas() {
      this.llenarNotasSeleccionadas();
    },
  },
};
</script>

<style scoped>
.derecha {
  text-align: right !important;
  align-content: right !important;
}
.izquierda {
  text-align: left !important;
  align-content: left !important;
}
</style>
