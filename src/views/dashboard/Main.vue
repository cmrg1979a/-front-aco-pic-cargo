<template>
  <v-app id="inspire">
    <v-navigation-drawer
      width="320"
      v-model="$store.state.drawer"
      app
      v-if="mostrarBtnMenu"
    >
      <listMenu />
    </v-navigation-drawer>

    <v-app-bar app elevation="0" v-if="mostrarBtnMenu" :color="colorBar()" dark>
      <v-app-bar-nav-icon
        v-if="mostrarBtnMenu"
        @click="$store.state.drawer = !$store.state.drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $store.state.mainTitle }}</v-toolbar-title>
      <!-- CONTROL DE GASTOS -->
      <v-spacer></v-spacer>
      <!-- <span
        class="white--text mr-5"
        v-if="
          getNameUrl() != 'newQuote' &&
          getNameUrl() != 'verQuote' &&
          getNameUrl() != 'editQuote' &&
          getNameUrl() != 'editQuote' &&
          !this.$route.params.id_house
        "
      >
        ¡Atención! te quedan 15 días de prueba gratis.
      </span>
      <v-btn
        v-if="
          getNameUrl() != 'newQuote' &&
          getNameUrl() != 'verQuote' &&
          getNameUrl() != 'editQuote' &&
          getNameUrl() != 'editQuote' &&
          !this.$route.params.id_house
        "
        color="#527AC7"
        dark
        small
        >
        Adquiere ahora
        </v-btn
      > -->
      <b v-if="this.$route.params.id_house" class="mr-10 text-h4">
        PROFIT PR:
        {{
          (
            (this.$store.state.totalTotalIngresos
              ? this.$store.state.totalTotalIngresos
              : 0) -
            (this.$store.state.totalTotalEgresos
              ? this.$store.state.totalTotalEgresos
              : 0)
          ).toFixed(2)
        }}
        USD
      </b>

      <b v-if="this.$route.params.id_house" class="mr-10 text-h4">
        / OP:
        {{
          (
            (this.$store.state.totalTotalIngresosOp
              ? this.$store.state.totalTotalIngresosOp
              : 0) -
            (this.$store.state.totalTotalEgresosOp
              ? this.$store.state.totalTotalEgresosOp
              : 0)
          ).toFixed(2)
        }}
        USD
      </b>
      <!-- QUOTE -->
      <v-spacer></v-spacer>
      <!-- nuevo -->
      <label class="monto" v-if="getNameUrl() == 'newQuote'">
        Profit / Ganancia
        {{
          currencyFormat(
            $store.state.pricing.totalVenta - $store.state.pricing.totalCosto,
          )
        }}
      </label>
      <v-spacer
        v-if="getNameUrl() == 'newQuote' && !!$store.state.pricing.btnRegistrar"
      ></v-spacer>

      <v-btn
        color="#009688"
        dark
        v-if="getNameUrl() == 'newQuote' && !!$store.state.pricing.btnRegistrar"
        @click="guardarCotizacion()"
        :disabled="$store.state.pricing.bloquearBtnImprimir"
      >
        GUARDAR
      </v-btn>
      <!-- editar -->
      <label class="monto" v-if="getNameUrl() == 'editQuote'">
        Profit / Ganancia
        {{
          currencyFormat(
            $store.state.pricing.totalVenta - $store.state.pricing.totalCosto,
          )
        }}
      </label>
      <v-spacer v-if="getNameUrl() == 'editQuote'"></v-spacer>

      <v-btn
        color="#009688"
        dark
        v-if="
          getNameUrl() == 'editQuote' &&
          $store.state.pricing.mostrarBtnActualizarFlag
        "
        @click="editarCotizacion()"
      >
        GUARDAR CAMBIOS
      </v-btn>
      <!-- ver -->
      <label class="monto" v-if="getNameUrl() == 'verQuote'">
        Profit / Ganancia
        {{
          currencyFormat(
            $store.state.pricing.totalVenta - $store.state.pricing.totalCosto,
          )
        }}
      </label>
      <v-spacer v-if="getNameUrl() == 'verQuote'"></v-spacer>

      <v-btn
        color="#009688"
        dark
        v-if="getNameUrl() == 'verQuote'"
        @click="handleEditarQuote()"
      >
        EDITAR
      </v-btn>
      <v-btn
        v-if="getNameUrl() == 'verQuote'"
        class="mx-1"
        color="light-blue darken-3"
        dark
        @click="abrirCorreo()"
      >
        <v-icon class="mx-1" dense small>mdi-email-fast</v-icon>
        ENVIAR MAIL
      </v-btn>

      <v-btn
        v-if="getNameUrl() == 'editQuote'"
        class="mx-1"
        color="light-blue darken-3"
        dark
        @click="abrirCorreo()"
      >
        <v-icon class="mx-1" dense small>mdi-email-fast</v-icon>
        ENVIAR MAIL
      </v-btn>

      <v-btn
        v-if="getNameUrl() == 'verQuote'"
        class="mx-1"
        color="light-blue darken-3"
        dark
        @click="copiarCotizacion()"
      >
        <v-icon class="mx-1" dense small>mdi-content-copy</v-icon>
        COPIAR COTIZACIÓN
      </v-btn>

      <!--MODULO CLIENTES-->
      <v-btn
        v-if="
          getNameUrl() == 'nuevoClientes' &&
          $store.state.entities.showBtnSaveFlag
        "
        color="success"
        class="ml-auto"
        dark
        @click="registrarCliente"
        >Guardar CLIENTE</v-btn
      >

      <!--MODULO PROVEEDORES-->
      <v-btn
        v-if="
          getNameUrl() == 'nuevoProveedor' &&
          $store.state.entities.showBtnSaveFlag
        "
        color="success"
        class="ml-auto"
        dark
        @click="registrarProveedor"
        :disabled="$store.state.entities.disabledBtnSave"
        >Guardar Proveedor</v-btn
      >

      <label class="monto" v-if="routeAduana.includes(getNameUrl())">
        {{
          currencyFormat(
            ($store.state.aduana.totalVenta
              ? $store.state.aduana.totalVenta
              : 0) -
              ($store.state.aduana.totalCosto
                ? $store.state.aduana.totalCosto
                : 0),
          )
        }}
      </label>
      <v-spacer></v-spacer>
      <v-btn
        color="#009688"
        dark
        v-if="getNameUrl() == 'EditarAduana'"
        @click="editarCotizacionAduana()"
      >
        GUARDAR CAMBIOS
      </v-btn>

      <v-btn
        color="#009688"
        dark
        v-if="
          getNameUrl() == 'VerAduana' &&
          $store.state.aduana.mostrarBtnActualizarFlag
        "
        @click="ira('EditarAduana', $route.params.id)"
      >
        <v-icon>mdi-account-tie-hat</v-icon> EDITAR
      </v-btn>

      <!-- <v-btn
        color="#009688"
        dark
        @click="abrirModalPilotoAutomatico()"
        v-if="getNameUrl() == 'editQuote' && $store.state.pricing.step == 2"
      >
        COTIZAR PILOTO AUTOMATICO
      </v-btn> -->
      <v-spacer v-if="getNameUrl() == 'controlMasterEditar'"></v-spacer>
      <v-btn
        color="#009688"
        dark
        v-if="getNameUrl() == 'controlMasterEditar'"
        @click="ira('listMaster', null)"
      >
        VOLVER AL LISTADO
      </v-btn>
    </v-app-bar>

    <v-main class="main">
      <router-view />
    </v-main>
    <!-- <v-footer dark padless class="mt-auto">
      <v-card class="flex" flat tile>
        <v-card-title class="teal">
          <strong class="subheading"
            >Get connected with us on social networks!</strong
          >

          <v-spacer></v-spacer>

          <v-btn v-for="icon in icons" :key="icon" class="mx-4" dark icon>
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} — <strong>PIC CARGO</strong>
        </v-card-text>
      </v-card>
    </v-footer> -->
    <div v-if="$store.state.dialogProcessing" class="dialogOverlay"></div>
    <div v-if="$store.state.dialogProcessing" class="dialogProcessing">
      <!-- <div class="dialogOverlay"></div> -->
      <LoadingComponent />
    </div>

    <!-- Modal de autenticación admin para editar cotizaciones aprobadas -->
    <v-dialog v-model="dialogAdminAuth" max-width="400" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Autenticación Requerida
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="mb-4">
            Esta cotización está <strong>APROBADA</strong>. Ingrese las
            credenciales de administrador para continuar.
          </p>
          <v-text-field
            v-model="adminUser"
            label="Usuario o Email"
            prepend-icon="mdi-account"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="adminPassword"
            label="Contraseña"
            prepend-icon="mdi-lock"
            :type="showAdminPassword ? 'text' : 'password'"
            :append-icon="showAdminPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showAdminPassword = !showAdminPassword"
            outlined
            dense
          ></v-text-field>
          <v-alert v-if="adminAuthError" type="error" dense class="mt-2">
            {{ adminAuthError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cerrarDialogAdminAuth()">
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            :loading="adminAuthLoading"
            @click="validarAdminAuth()"
          >
            Ingresar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogProveedor" width="35%">
      <v-card>
        <v-card-title> Seleccionar proveedor: </v-card-title>
        <v-card-text>
          <v-autocomplete
            multiple
            :items="this.$store.state.itemsDataRoleList"
            small-chips
            item-value="id"
            item-text="name"
            persistent
            outlined
            label="Tipo Proveedor"
            dense
            v-model="idRole"
          >
          </v-autocomplete>
          <v-simple-table>
            <thead>
              <tr>
                <th></th>
                <th>Contacto</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dato, index) in lstDatosTarifa" :key="index">
                <td>
                  <v-checkbox v-model="dato.selected"></v-checkbox>
                </td>
                <td>{{ dato.contacto }}</td>
                <td>{{ dato.email }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="abrirCorreoSend">Enviar Correo</v-btn>
          <v-btn color="error" @click="dialogProveedor = false">
            Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPilotoAutomatico"
      scrollable
      persistent
      max-width="75%"
    >
      <v-card v-if="dialogPilotoAutomatico">
        <v-card-title primary-title>
          COTIZACIÓN PILOTO AUTOMÁTICO
          <v-spacer></v-spacer>
          <v-btn color="info" icon @click="dialogPilotoAutomatico = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <CotizacionPilotoAutomatico />
        </v-card-text>
        <!-- <v-card-actions> </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import leftMenu from "@/components/leftMenu";
import listMenu from "@/components/listMenu";
import CotizacionPilotoAutomatico from "@/components/folderPricing/CotizacionPilotoAutomatico.vue";
import { Store, mapActions } from "vuex";
import mixins from "@/components/mixins/funciones";
import Swal from "sweetalert2";
import moment from "moment";
import axios from "axios";
import LoadingComponent from "../../components/comun/loadingComponent.vue";
import { io } from "socket.io-client";
export default {
  created() {
    this.socket = io(process.env.VUE_APP_URL_MAIN);
    this.socket.on("connect", () => {
      console.log("Conectado al servidor Socket.IO:", this.socket.id);
    });
    this.socket.on("connect_error", (err) => {
      console.error("Error al conectar con Socket.IO:", err);
    });
  },
  mixins: [mixins],
  data() {
    return {
      mostrarBtnMenu: true,
      routePricing: ["newQuote", "verQuote", "editQuote"],
      routeAduana: ["newCotizacionAduana", "EditarAduana", "VerAduana"],
      dialogAdminAuth: false,
      adminUser: "",
      adminPassword: "",
      showAdminPassword: false,
      adminAuthLoading: false,
      adminAuthError: "",
      dialogProveedor: false,
      dialogPilotoAutomatico: false,
      idRole: [],
      lstDatosTarifa: [],
    };
  },
  components: {
    leftMenu,
    listMenu,
    LoadingComponent,
    CotizacionPilotoAutomatico,
  },
  async mounted() {
    let urlPricing = ["newQuote", "verQuote", "editQuote"];
    this.socket.emit(
      "join-empresa",
      JSON.parse(sessionStorage.getItem("dataUser"))[0].id_branch,
    );

    this.socket.on("nueva-operacion", (data) => {
      if (!urlPricing.includes(this.$route.name)) {
        Swal.fire({
          title: "¡Nueva Cotización!",
          text: data.mensaje,
          icon: "info",
          timer: 5000, // 30 segundos
          timerProgressBar: true,
          showConfirmButton: false,
          allowEnterKey: false,
          allowOutsideClick: false,
          allowOutsideClick: false,
        });
      }
    });
  },
  beforeMount() {
    this.mostrarBtnMenu = !JSON.parse(sessionStorage.getItem("dataBranch"))[0]
      .esnuevoflag;
    this.$store.state.drawer = this.mostrarBtnMenu;
  },
  methods: {
    ...mapActions([
      "copiarQuote",
      "crearCarpetaOneDrive",
      "actualizarURLEnElQuote",
      "updateQuote",
      "validarCosto",
      "GuardaCostosFinalesQuote",
      "generaInstructivo",
      "guardarCliente",
      "actualizarCliente",
      "guardarProveedor",
      "actualizarProveedor",
      "registrarQuote",
      "actualizarQuoteAduana",
      "_getRole",
    ]),
    async guardarCotizacion() {
      let validacion = this.validarRegistro();
      if (!!validacion) {
        this.$store.state.spiner = true;
        await this.registrarQuote({ fullflag: true }).catch((err) => {
          console.log("registrarQuote", err);
        });

        this.$store.state.spiner = false;
        let vm = this;
        Swal.fire({
          icon: "info",
          title: "Aviso",
          text: vm.$store.state.pricing.mensaje,
          confirmButtonText: "Ir a ver",
        }).then((result) => {
          if (result.isConfirmed) {
            vm.$router.push({
              name: "verQuote",
              params: { id: vm.$store.state.pricing.id },
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
    async editarCotizacion() {
      // let val = await this.validarCosto();
      let val = true;
      val = !this.$store.state.pricing.opcionCostos.some(
        (v) =>
          !v.date_end || !v.tiempo_transito || !this.isDateValid(v.date_end),
      );

      // // -----------------------------------------------------
      if (val) {
        this.$store.state.spiner = false;
        await this.updateQuote();

        console.log("step", this.$store.state.pricing.step);

        this.$router.push({
          name: "verQuote",
          params: {
            id: this.$store.state.pricing.id,
            step: this.$store.state.pricing.step
              ? this.$store.state.pricing.step
              : 1,
          },
        });
        this.$store.state.spiner = false;
      } else {
        Swal.fire({
          title: "ADVERTENCIA",
          icon: "error",
          text: "Existe una o más Fechas de validez y/o tiempos en tránsito, INCOMPLETOS. Verifique.",
        });
        this.$store.state.pricing.tab = 2;
      }
    },
    async editarCotizacionAduana() {
      // let val = await this.validarCosto();
      let val = true;
      val = !this.$store.state.aduana.opcionCostos.some(
        (v) =>
          !v.date_end || !v.tiempo_transito || !this.isDateValid(v.date_end),
      );

      // // -----------------------------------------------------
      if (val) {
        this.$store.state.spiner = false;
        await this.actualizarQuoteAduana();

        console.log("step", this.$store.state.aduana.step);

        this.$router.push({
          name: "VerAduana",
          params: {
            id: this.$store.state.aduana.id,
            step: this.$store.state.aduana.step
              ? this.$store.state.aduana.step
              : 1,
          },
        });
        this.$store.state.spiner = false;
      } else {
        Swal.fire({
          title: "ADVERTENCIA",
          icon: "error",
          text: "Existe una o más Fechas de validez y/o tiempos en tránsito, INCOMPLETOS. Verifique.",
        });
        this.$store.state.aduana.tab = 2;
      }
    },
    async abrirCorreo() {
      this.idRole = [];
      this.dialogProveedor = true;
      await this._getRole();
    },
    // abrirCorreoSend() {
    //   const selected = this.lstDatosTarifa.filter((v) => v.selected);
    //   const to = selected
    //     .map((v) => v.email)
    //     .filter((e) => e)
    //     .join(",");
    //   let id_incoterms = this.$store.state.pricing.datosPrincipales.idincoterms
    //     ? this.$store.state.pricing.datosPrincipales.idincoterms
    //     : "";
    //   let incoterms = this.$store.state.pricing.listIncoterms.find(
    //     (v) => v.id == id_incoterms,
    //   );
    //   // Cambiamos acentos por letras normales
    //   const subject = encodeURIComponent(
    //     "Cotizacion Nro:" + this.$store.state.pricing.nro_quote,
    //   );

    //   const lineasBody = [
    //     "Hola colega,",
    //     "Me ayudas cotizando este embarque:",
    //     "",

    //     ` INCOTERMS:  ${incoterms.name}          `,
    //     ` DIRECCION PROVEEDOR:  `,
    //     ` PESO:  ${this.$store.state.pricing.datosPrincipales.peso || ""} `,
    //     ` M3:  ${this.$store.state.pricing.datosPrincipales.volumen || ""} `,
    //     ` COMMODITY:  `,
    //     "-------------------------------------------",
    //     "",
    //     "Saludos cordiales.",
    //   ];

    //   const body = encodeURIComponent(lineasBody.join("\r\n"));
    //   window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    // },
    async abrirCorreoSend() {
      const selected = this.lstDatosTarifa.filter((v) => v.selected);
      const to = selected
        .map((v) => v.email)
        .filter((e) => e)
        .join(",");

      const subject = "Cotizacion Nro: " + this.$store.state.pricing.nro_quote;

      // 1. Preparamos el HTML de la tabla
      const tablaHtml = `
    <div style="font-family: Arial, sans-serif;">
      <p>Hola colega, me ayudas cotizando este embarque:</p>
      <table border="1" style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr style="background-color: #eeeeee;">
          <th style="padding: 8px; border: 1px solid #333;">CONCEPTO</th>
          <th style="padding: 8px; border: 1px solid #333;">DETALLE</th>
        </tr>
        <tr><td style="padding: 8px; border: 1px solid #333;">INCOTERMS</td><td style="padding: 8px; border: 1px solid #333;">EXWORKS</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #333;">PESO</td><td style="padding: 8px; border: 1px solid #333;">${
          this.$store.state.pricing.datosPrincipales.peso || ""
        }</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #333;">M3</td><td style="padding: 8px; border: 1px solid #333;">${
          this.$store.state.pricing.datosPrincipales.volumen || ""
        }</td></tr>
      </table>
      <p>Saludos.</p>
    </div>
  `;

      try {
        // 2. Ejecutamos la copia al portapapeles primero
        const blob = new Blob([tablaHtml], { type: "text/html" });
        const data = [new ClipboardItem({ ["text/html"]: blob })];
        await navigator.clipboard.write(data);

        // 3. EL ALERT: Detiene la ejecución hasta que el usuario dé clic
        // Esto asegura que el usuario sepa que ya se copió
        alert(
          "Información de cotización copiada. Al aceptar, se abrirá Outlook. (Luego presiona Ctrl+V)",
        );

        // 4. ABRIR EL MAIL: Solo ocurre DESPUÉS de cerrar el alert
        const body = encodeURIComponent("Hola colega, (PEGA LA TABLA AQUÍ)");
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(
          subject,
        )}&body=${body}`;
      } catch (err) {
        console.error("Error al copiar:", err);
        alert("Hubo un problema al copiar los datos automáticamente.");
      }
    },
    copiarCotizacion() {
      Swal.fire({
        title: "ADVERTENCIA",
        text: "¿Desea Crear una copia de esta cotización?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.state.spiner = true;
          await this.copiarQuote({
            fullflag: true,
            id: this.$route.params.id,
          }).catch((err) => {
            console.log("copiarQuote", err);
          });

          this.$store.state.spiner = false;
          let vm = this;
          console.log(vm.$store.state.pricing.id);
          Swal.fire({
            icon: "info",
            title: "Aviso",
            text: vm.$store.state.pricing.mensaje,
            confirmButtonText: "Ir a ver",
          }).then((result) => {
            if (result.isConfirmed) {
              vm.$router.push({
                name: "verQuote",
                params: { id: vm.$store.state.pricing.id },
              });
              this.$nextTick(() => {
                location.reload();
              });
              // setTimeout(() => {
              // }, 100);
            }
          });
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
      });
    },
    isDateValid(date) {
      if (!date) {
        return true; // Pasa la validación si el campo está vacío
      }

      const selectedDate = moment(date, "YYYY-MM-DD", true);
      const today = moment();

      return selectedDate.isAfter(today);
    },
    validarRegistro() {
      let val = true;

      if (
        this.$store.state.pricing.opcionCostos.some((v) => v.date_end == "")
      ) {
        Swal.fire({
          icon: "warning",
          title: "Aviso",
          text: "La fecha de validez para las opciones es requerida.",
        });
        val = false;
      } else {
        if (
          !this.$store.state.pricing.opcionCostos.some((v) =>
            this.isDateValid(v.date_end),
          )
        ) {
          Swal.fire({
            icon: "warning",
            title: "Aviso",
            text: "La fecha de validez  para las opciones debe ser mayor que la fecha actual.",
          });
          val = false;
        }
      }
      if (
        !this.$store.state.pricing.opcionCostos.some((v) => v.tiempo_transito)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Aviso",
          text: "El tiempo de transito  para las opciones es requerido. ",
        });
        val = false;
      }
      if (val) {
        return val;
      }

      let validacioncosto = null;
      this.$store.state.pricing.opcionCostos.forEach((element) => {
        let validateCostos = this.validateCost({
          costo: element.listCostos.filter((v) => v.esopcionflag == 1),
          multiplicador: this.$store.state.pricing.listMultiplicador,
          services: this.$store.state.pricing.listServices,
        });
        if (validateCostos.estado) {
          validacioncosto = validateCostos;
          val = false;
        }
      });
      if (val) {
        Swal.fire({
          icon: "warning",
          title: "Aviso",
          text: validacioncosto.mensaje,
        });
        val = validacioncosto.estado;
      }
      return val;
    },
    getNameUrl() {
      let name = this.$route.name;

      return name;
    },
    obtenerTipoAlert() {
      let type = "red";
      let Url = ["newQuote", "editQuote", "verQuote"];
      if (Url.includes(this.getNameUrl())) {
        if (
          this.$store.state.pricing.totalCosto -
            this.$store.state.pricing.totalVenta <
          0
        ) {
          type = "success";
        }
        if (
          this.$store.state.pricing.totalCosto -
            this.$store.state.pricing.totalVenta >
          0
        ) {
          type = "error";
        }
      }
      let Url2 = ["newCotizacionAduana", "EditarAduana", "VerAduana"];
      if (Url.includes(this.getNameUrl())) {
        if (
          this.$store.state.aduana.totalCosto -
            this.$store.state.aduana.totalVenta <
          0
        ) {
          type = "success";
        }
        if (
          this.$store.state.aduana.totalCosto -
            this.$store.state.aduana.totalVenta >
          0
        ) {
          type = "error";
        }
      }

      return type;
    },
    currencyFormat(number) {
      let money = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "USD",
      }).format(number);
      return money;
    },
    colorBar() {
      let color = "#252C32";
      let Url = [
        "newQuote",
        "editQuote",
        "verQuote",
        "newCotizacionAduana",
        "EditarAduana",
        "VerAduana",
      ];
      if (Url.includes(this.getNameUrl())) {
        color = this.obtenerTipoAlert();
      }
      return color;
    },
    ira(ruta, id) {
      this.$router.push({
        name: ruta,
        params: {
          id: id,
        },
      });
      setTimeout(() => {
        //window.location.reload();
      }, 100);
    },
    esUsuarioAdmin() {
      try {
        const dataUser = JSON.parse(sessionStorage.getItem("dataUser"));
        if (dataUser && dataUser[0]) {
          // Verificar en ambos campos: 'user' y 'usuario'
          const userEmail = dataUser[0].user || dataUser[0].usuario || "";
          console.log("Usuario actual en sesión:", userEmail);
          return userEmail.toLowerCase() === "cmrg1979a@gmail.com";
        }
      } catch (e) {
        console.error("Error al verificar usuario admin:", e);
      }
      return false;
    },
    esCotizacionAprobada() {
      const pricing = this.$store.state.pricing;

      // Verificar aprobadoflag (boolean)
      if (pricing.aprobadoflag === true) {
        console.log("Cotización aprobada por aprobadoflag=true");
        return true;
      }

      if (
        pricing.datosPrincipales &&
        pricing.datosPrincipales.nameStatusQuote
      ) {
        const statusName = pricing.datosPrincipales.nameStatusQuote
          .toUpperCase()
          .trim();
        console.log("Status nameStatusQuote:", statusName);
        if (statusName === "APROBADO" || statusName === "APROBADA") {
          console.log("Cotización aprobada por nameStatusQuote:", statusName);
          return true;
        }
      }

      if (pricing.datosPrincipales && pricing.datosPrincipales.id_status) {
        const statusList = pricing.listQuoteStatus || [];
        const currentStatus = statusList.find(
          (s) => s.id === pricing.datosPrincipales.id_status,
        );
        console.log("Status por id_status:", currentStatus);
        if (currentStatus && currentStatus.name) {
          const statusName = currentStatus.name.toUpperCase().trim();
          if (statusName === "APROBADO" || statusName === "APROBADA") {
            console.log("Cotización aprobada por listQuoteStatus:", statusName);
            return true;
          }
        }
      }

      console.log("Cotización NO está aprobada");
      return false;
    },
    handleEditarQuote() {
      const aprobada = this.esCotizacionAprobada();
      const esAdmin = this.esUsuarioAdmin();

      console.log(
        "handleEditarQuote - aprobada:",
        aprobada,
        "esAdmin:",
        esAdmin,
      );

      if (!aprobada) {
        this.ira("editQuote", this.$route.params.id);
        return;
      }

      if (esAdmin) {
        this.ira("editQuote", this.$route.params.id);
        return;
      }

      this.dialogAdminAuth = true;
      this.adminUser = "";
      this.adminPassword = "";
      this.adminAuthError = "";
    },
    cerrarDialogAdminAuth() {
      this.dialogAdminAuth = false;
      this.adminUser = "";
      this.adminPassword = "";
      this.adminAuthError = "";
    },
    async validarAdminAuth() {
      this.adminAuthError = "";

      if (!this.adminUser || !this.adminPassword) {
        this.adminAuthError = "Ingrese usuario y contraseña";
        return;
      }

      this.adminAuthLoading = true;

      try {
        const config = {
          method: "post",
          url: process.env.VUE_APP_URL_MAIN + "singin",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            user: this.adminUser,
            password: this.adminPassword,
          }),
        };

        const response = await axios(config);

        if (response.data.estadoflag) {
          const userEmail =
            response.data.data[0].user || response.data.data[0].usuario;

          if (userEmail && userEmail.toLowerCase() === "cmrg1979a@gmail.com") {
            // Es el admin, permitir edición
            this.cerrarDialogAdminAuth();
            this.ira("editQuote", this.$route.params.id);
          } else {
            this.adminAuthError =
              "Solo el usuario administrador puede editar cotizaciones aprobadas";
          }
        } else {
          this.adminAuthError =
            response.data.mensaje || "Credenciales incorrectas";
        }
      } catch (error) {
        console.error("Error en validación admin:", error);
        this.adminAuthError = "Error al validar credenciales";
      } finally {
        this.adminAuthLoading = false;
      }
    },
    isDateValid(date) {
      if (!date) {
        return true; // Pasa la validación si el campo está vacío
      }
      const selectedDate = moment(date, "YYYY-MM-DD", true);
      const today = moment();
      return selectedDate.isAfter(today);
    },
    isClienteInternacional() {
      let val = this.$store.state.masterusuarios.lstTipoTransaccion.some(
        (v) => {
          return (
            v.codigo == "02" &&
            v.id == this.$store.state.entities.cliente.id_tipotransaccion
          );
        },
      );

      return val;
    },
    async registrarCliente() {
      var vm = this;

      vm.$store.state.spiner = true;
      await vm.guardarCliente(false);
      vm.$store.state.spiner = false;
    },
    async modificarCliente() {
      var vm = this;

      vm.$store.state.entities.isStep1Valid = true;
      vm.$store.state.entities.isStep2Valid = true;
      vm.$store.state.entities.isStep3Valid = true;
      vm.$store.state.entities.isStep4Valid = true;
      vm.$store.state.entities.isStep5Valid = true;
      vm.$store.state.entities.isStep6Valid = true;

      let okStep1 = true;
      if (vm.$store.state.entities.cliente) {
        if (!vm.$store.state.entities.cliente.id_tipopersona) {
          okStep1 = false;
        }

        if (!vm.$store.state.entities.cliente.nombrecompleto) {
          okStep1 = false;
        }

        if (!vm.$store.state.entities.cliente.id_tipotransaccion) {
          okStep1 = false;
        }

        if (!vm.$store.state.entities.cliente.id_pais) {
          okStep1 = false;
        }

        if (
          vm.$store.state.entities.cliente.emailaddress &&
          !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            vm.$store.state.entities.cliente.emailaddress,
          )
        ) {
          okStep1 = false;
        }
      }

      let okStep2_1 = true;
      if (vm.$store.state.entities.lstTelefonos.length > 0) {
        vm.$store.state.entities.lstTelefonos.map((v) => {
          if (!v.id_tipotelefono) {
            okStep2_1 = false;
          }

          if (!v.telefono) {
            okStep2_1 = false;
          }
        });
      }

      let okStep2_2 = true;
      if (vm.$store.state.entities.lstContactos.length > 0) {
        vm.$store.state.entities.lstContactos.map((v) => {
          if (!v.nombre) {
            okStep2_2 = false;
          }

          if (!v.id_tipotelefono) {
            okStep2_2 = false;
          }

          if (!v.telefono) {
            okStep2_2 = false;
          }
        });
      }

      let okStep3_1 = true;
      if (vm.$store.state.entities.lstConvenios.length > 0) {
        vm.$store.state.entities.lstConvenios.map((v) => {
          if (!v.fecha) {
            okStep3_1 = false;
          }

          if (v.dias_credito < 0) {
            okStep3_1 = false;
          }

          if (
            v.email_soporte &&
            !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v.email_soporte,
            )
          ) {
            okStep3_1 = false;
          }
        });
      }

      let okStep3_2 = true;
      if (vm.$store.state.entities.lstTarifas.length > 0) {
        vm.$store.state.entities.lstTarifas.map((v) => {
          if (!v.fecha) {
            okStep3_2 = false;
          }

          if (!v.codigo) {
            okStep3_2 = false;
          }

          if (
            v.email_soporte &&
            !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v.email_soporte,
            )
          ) {
            okStep3_2 = false;
          }

          if (v.tarifa < 0) {
            okStep3_2 = false;
          }
        });
      }

      let okStep4 = true;
      if (vm.$store.state.entities.lstInformacionBancaria.length > 0) {
        vm.$store.state.entities.lstInformacionBancaria.map((v) => {
          if (!v.nro_cuenta) {
            okStep4 = false;
          }

          if (!v.cci) {
            okStep4 = false;
          }

          if (!v.id_banco) {
            okStep4 = false;
          }

          if (!v.id_coins) {
            okStep4 = false;
          }

          if (vm.isClienteInternacional()) {
            if (!v.nro_swift) {
              okStep4 = false;
            }

            if (!v.id_intermediario) {
              okStep4 = false;
            }

            if (!v.nro_cuenta_intermediario) {
              okStep4 = false;
            }
          }
        });
      }

      if (!okStep1) {
        vm.$store.state.entities.isStep1Valid =
          !vm.$store.state.entities.isStep1Valid;
      } else if (!okStep2_1 || !okStep2_2) {
        vm.$store.state.entities.isStep2Valid =
          !vm.$store.state.entities.isStep2Valid;
      } else if (!okStep3_1 || !okStep3_2) {
        vm.$store.state.entities.isStep3Valid =
          !vm.$store.state.entities.isStep3Valid;
      } else if (!okStep4) {
        vm.$store.state.entities.isStep4Valid =
          !vm.$store.state.entities.isStep4Valid;
      } else {
        vm.$store.state.spiner = true;
        await vm.actualizarCliente();
        vm.$store.state.spiner = false;
      }
    },
    isProveedorInternacional() {
      let val = this.$store.state.masterusuarios.lstTipoTransaccion.some(
        (v) => {
          return (
            v.codigo == "02" &&
            v.id == this.$store.state.entities.proveedor.id_tipotransaccion
          );
        },
      );

      return val;
    },
    isShipper() {
      let val = this.$store.state.itemsDataRoleList.some((v) => {
        const item = (v.name.split("-")[1] || "").trim().toUpperCase();
        return (
          v.id == this.$store.state.entities.proveedor.id_tipoproveedor &&
          item == "SHIPPER"
        );
      });

      return val;
    },
    isNaviera() {
      let val = this.$store.state.itemsDataRoleList.some((v) => {
        const item = (v.name.split("-")[1] || "").trim().toUpperCase();
        return (
          v.id == this.$store.state.entities.proveedor.id_tipoproveedor &&
          item == "NAVIERA"
        );
      });

      return val;
    },
    isAlmacen() {
      let val = this.$store.state.itemsDataRoleList.some((v) => {
        const item = (v.name.split("-")[1] || "").trim().toUpperCase();
        return (
          v.id == this.$store.state.entities.proveedor.id_tipoproveedor &&
          item == "ALMACEN"
        );
      });

      return val;
    },
    async registrarProveedor() {
      var vm = this;

      vm.$store.state.entities.isStep4Valid = true;

      let okStep4 = true;
      if (vm.$store.state.entities.lstInformacionBancaria.length > 0) {
        vm.$store.state.entities.lstInformacionBancaria.map((v) => {
          if (!v.nro_cuenta) {
            okStep4 = false;
          }

          if (!v.cci) {
            okStep4 = false;
          }

          if (!v.id_banco) {
            okStep4 = false;
          }

          if (!v.id_coins) {
            okStep4 = false;
          }

          if (vm.isProveedorInternacional()) {
            if (!v.nro_swift) {
              okStep4 = false;
            }

            if (!v.id_intermediario) {
              okStep4 = false;
            }

            if (!v.nro_cuenta_intermediario) {
              okStep4 = false;
            }
          }
        });
      }

      if (!okStep4) {
        vm.$store.state.entities.isStep4Valid =
          !vm.$store.state.entities.isStep4Valid;
      } else {
        vm.$store.state.spiner = true;
        await vm.guardarProveedor();
        vm.$store.state.spiner = false;
      }
    },
    async modificarProveedor() {
      var vm = this;

      vm.$store.state.entities.isStep1Valid = true;
      vm.$store.state.entities.isStep2Valid = true;
      vm.$store.state.entities.isStep3Valid = true;
      vm.$store.state.entities.isStep4Valid = true;

      let okStep1 = true;
      if (vm.$store.state.entities.proveedor) {
        if (!vm.$store.state.entities.proveedor.nombrecompleto) {
          okStep1 = false;
        }

        if (!vm.$store.state.entities.proveedor.id_tipoproveedor) {
          okStep1 = false;
        } else if (
          vm.isShipper() &&
          !vm.$store.state.entities.proveedor.producto
        ) {
          okStep1 = false;
        }

        if (!vm.$store.state.entities.proveedor.id_tipotransaccion) {
          okStep1 = false;
        }

        if (!vm.$store.state.entities.proveedor.id_pais) {
          okStep1 = false;
        }

        if (
          vm.$store.state.entities.proveedor.emailaddress &&
          !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            vm.$store.state.entities.proveedor.emailaddress,
          )
        ) {
          okStep1 = false;
        }

        if (
          vm.isNaviera() &&
          vm.$store.state.entities.proveedor.dias_sobreestadia < 0
        ) {
          okStep1 = false;
        }

        if (
          vm.isAlmacen() &&
          vm.$store.state.entities.proveedor.dias_almacenaje < 0
        ) {
          okStep1 = false;
        }
      }

      let okStep2_1 = true;
      if (vm.$store.state.entities.lstTelefonos.length > 0) {
        vm.$store.state.entities.lstTelefonos.map((v) => {
          if (!v.id_tipotelefono) {
            okStep2_1 = false;
          }

          if (!v.telefono) {
            okStep2_1 = false;
          }
        });
      }

      let okStep2_2 = true;
      if (vm.$store.state.entities.lstContactos.length > 0) {
        vm.$store.state.entities.lstContactos.map((v) => {
          if (!v.nombre) {
            okStep2_2 = false;
          }

          if (!v.id_tipotelefono) {
            okStep2_2 = false;
          }

          if (!v.telefono) {
            okStep2_2 = false;
          }
        });
      }

      let okStep3_1 = true;
      if (vm.$store.state.entities.lstConvenios.length > 0) {
        vm.$store.state.entities.lstConvenios.map((v) => {
          if (!v.fecha) {
            okStep3_1 = false;
          }

          if (v.dias_credito < 0) {
            okStep3_1 = false;
          }

          if (
            v.email_soporte &&
            !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v.email_soporte,
            )
          ) {
            okStep3_1 = false;
          }
        });
      }

      let okStep3_2 = true;
      if (vm.$store.state.entities.lstTarifas.length > 0) {
        vm.$store.state.entities.lstTarifas.map((v) => {
          if (!v.fecha) {
            okStep3_2 = false;
          }

          if (!v.codigo) {
            okStep3_2 = false;
          }

          if (
            v.email_soporte &&
            !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v.email_soporte,
            )
          ) {
            okStep3_2 = false;
          }

          if (v.tarifa < 0) {
            okStep3_2 = false;
          }
        });
      }

      let okStep4 = true;
      if (vm.$store.state.entities.lstInformacionBancaria.length > 0) {
        vm.$store.state.entities.lstInformacionBancaria.map((v) => {
          if (!v.nro_cuenta) {
            okStep4 = false;
          }

          if (!v.cci) {
            okStep4 = false;
          }

          if (!v.id_banco) {
            okStep4 = false;
          }

          if (!v.id_coins) {
            okStep4 = false;
          }

          if (vm.isProveedorInternacional()) {
            if (!v.nro_swift) {
              okStep4 = false;
            }

            if (!v.id_intermediario) {
              okStep4 = false;
            }

            if (!v.nro_cuenta_intermediario) {
              okStep4 = false;
            }
          }
        });
      }

      if (!okStep1) {
        vm.$store.state.entities.isStep1Valid =
          !vm.$store.state.entities.isStep1Valid;
      } else if (!okStep2_1 || !okStep2_2) {
        vm.$store.state.entities.isStep2Valid =
          !vm.$store.state.entities.isStep2Valid;
      } else if (!okStep3_1 || !okStep3_2) {
        vm.$store.state.entities.isStep3Valid =
          !vm.$store.state.entities.isStep3Valid;
      } else if (!okStep4) {
        vm.$store.state.entities.isStep4Valid =
          !vm.$store.state.entities.isStep4Valid;
      } else {
        vm.$store.state.spiner = true;
        await vm.actualizarProveedor();
        vm.$store.state.spiner = false;
      }
    },
    abrirModalPilotoAutomatico() {
      this.dialogPilotoAutomatico = true;
    },
  },
  watch: {
    async idRole() {
      console.log("ssss");
      let id_proveedores = [];
      let lstDatosTarifa = [];
      if (this.idRole.length == 0) {
        return;
      }
      console.log("idRole", this.idRole);
      const config = {
        method: "get",
        url: process.env.VUE_APP_URL_MAIN + "entities/obtener_datos_tarifa",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        params: {
          id_modality: this.$store.state.pricing.datosPrincipales.idsentido,
          id_roles: this.idRole.join(","),
        },
      };

      await axios(config).then((res) => {
        let data = res.data;
        this.lstDatosTarifa = data.data.datos.map((v) => {
          return { ...v, selected: true };
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding: 10px !important;
  background: #f4f7fa;
}
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
  font-size: 2rem;
}
.dialogOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99960;
}
.dialogProcessing {
  min-height: 50%;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  z-index: 99999;
  text-align: center;
}
.wrap-text-button {
  white-space: normal !important;
  line-height: 1.2;
  text-align: center;
  padding: 8px 16px; /* ajustable */
}
</style>

<style>
/* Oculta en móviles (menos de 992px) */
@media (max-width: 991.98px) {
  .ocultarMovil {
    display: none;
  }
}
</style>
