<template>
  <v-card>
    <v-card-text>
      <v-form ref="formDatosCliente" :readonly="isFormReadonly">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoPersona"
                  item-text="descripcion"
                  item-value="id"
                  label="Persona Natural / Empresa"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.cliente.id_tipopersona"
                  @change="toggleNombre"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <!--<v-row v-if="showNombreCompleto">
              <v-col cols="12">
                <v-text-field dense label="Nombre Completo" :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.cliente.nombrecompleto" @blur="handleNombre"></v-text-field>                      
              </v-col>
            </v-row>
            <v-row v-if="showNombreFiscal">
              <v-col cols="12">
                <v-text-field dense label="Nombre Fiscal" :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.cliente.nombrecompleto" @blur="handleNombre"></v-text-field>
              </v-col>
            </v-row>-->

            <!--CUSTOM AUTOCOMPLETE-->
            <v-row>
              <v-col cols="12">
                <CustomAutocomplete
                  :items="$store.state.entities.lstProveedores_x_nombre"
                  :label="
                    showNombreCompleto ? 'Nombre Completo' : 'Nombre Fiscal'
                  "
                  :value="$store.state.entities.cliente.nombrecompleto"
                  v-on:search="handleNombre"
                  v-on:id="handleEditarCliente"
                  :loading="isNombreLoading"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  :disabled="false"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoTransaccion"
                  item-text="descripcion"
                  item-value="id"
                  label="Nacional / Extranjero"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.cliente.id_tipotransaccion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="$store.state.itemsDocumentsPais"
                  item-text="description"
                  item-value="id"
                  label="Tipo de Documento Fiscal"
                  v-model="$store.state.entities.cliente.id_tipodocumento"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <!--<v-text-field 
                  dense 
                  label="Nro De Documento" 
                  v-model="$store.state.entities.cliente.nro_documento"
                  :disabled="isNroDocumentoDisabled"
                ></v-text-field>-->
                <CustomAutocomplete
                  :items="$store.state.entities.lstProveedores_x_documento"
                  label="Nro De Documento"
                  :value="$store.state.entities.cliente.nro_documento"
                  v-on:search="handleDocumento"
                  v-on:id="handleEditarCliente"
                  :loading="isDocumentoLoading"
                  :disabled="isNroDocumentoDisabled"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  item-text="name"
                  item-value="id"
                  :items="$store.state.itemsPais"
                  label="País"
                  @change="_getState($store.state.entities.cliente.id_pais)"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.cliente.id_pais"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="$store.state.itemsState"
                  item-text="name"
                  item-value="id"
                  label="Región / Estado"
                  v-model="$store.state.entities.cliente.id_ciudad"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Dirección"
                  v-model="$store.state.entities.cliente.direccion"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Correo Electrónico"
                  v-model="$store.state.entities.cliente.emailaddress"
                  :rules="[(v) => validarCorreoElectronico(v)]"
                  :error-messages="correoErrors"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--CONVENIO ACTUAL-->
            <v-subheader class="px-0">
              Convenio Actual
              <v-spacer></v-spacer>
              <v-file-input
                v-if="showFormActions"
                accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf,.gif,.jpg,.jpeg,.png"
                label="Adjuntar Archivo"
                hide-input
                class="customFile"
                v-model="fileinput"
                @change="subirArchivoConvenio"
              ></v-file-input>
            </v-subheader>
            <v-row class="pl-5">
             <v-col cols="12" md="4">
                <v-text-field
                  dense
                  type="number"
                  suffix="días"
                  v-model="
                    $store.state.entities.cliente.convenioActual.dias_credito
                  "
                  label="Días de Crédito para el Pago"
                  :rules="[
                    (v) =>
                      v >= 0 ||
                      'Es necesario que ponga un número entero positivo',
                  ]"
                  @change="validarConvenioActual"
                ></v-text-field>
              </v-col>

             <v-col cols="12" md="4">
                <v-text-field
                  dense
                  type="date"
                  v-model="$store.state.entities.cliente.convenioActual.fecha"
                  label="Fecha Convenio"
                  @change="validarConvenioActual"
                ></v-text-field>
              </v-col>

             <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="
                    $store.state.entities.cliente.convenioActual.email_soporte
                  "
                  label="Email Soporte"
                  :rules="[(v) => validarCorreoElectronico(v)]"
                  :error-messages="correoConvenioActualErrors"
                  @change="validarConvenioActual"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--TELÉFONO ACTUAL-->
            <h2 class="my-2">Teléfono Principal</h2>
            <v-row class="pl-5">
              <v-col cols="12" md="6">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoTelefono"
                  item-text="descripcion"
                  item-value="id"
                  label="Tipo de Teléfono"
                  v-model="
                    $store.state.entities.cliente.telefonoActual.id_tipotelefono
                  "
                  @change="validarTelefonoActual"
                  :error-messages="
                    !$store.state.entities.cliente.telefonoActual
                      .id_tipotelefono
                      ? 'Dato Requerido'
                      : ''
                  "
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  label="Teléfono"
                  v-model="
                    $store.state.entities.cliente.telefonoActual.telefono
                  "
                  @change="validarTelefonoActual"
                  :error-messages="
                    !$store.state.entities.cliente.telefonoActual.telefono
                      ? 'Dato Requerido'
                      : ''
                  "
                ></v-text-field>
              </v-col>
            </v-row>

            <!--CONTACTO ACTUAL-->
            <h2 class="my-2">Telefono Adicional</h2>
            <v-row class="pl-5">
             <v-col cols="12" md="4">
                <v-text-field
                  dense
                  label="Nombre"
                  v-model="$store.state.entities.cliente.contactoActual.nombre"
                  @change="validarContactoActual"
                ></v-text-field>
              </v-col>
             <v-col cols="12" md="4">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoTelefono"
                  item-text="descripcion"
                  item-value="id"
                  label="Tipo de Teléfono"
                  v-model="
                    $store.state.entities.cliente.contactoActual.id_tipotelefono
                  "
                  @change="validarContactoActual"
                ></v-autocomplete>
              </v-col>
             <v-col cols="12" md="4">
                <v-text-field
                  dense
                  label="Teléfono"
                  v-model="
                    $store.state.entities.cliente.contactoActual.telefono
                  "
                  @change="validarContactoActual"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--NOTAS-->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  textarea
                  label="Comentarios / Notas Importantes"
                  v-model="$store.state.entities.cliente.notas"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions v-if="showNavigationButtons">
      <v-btn color="primary" class="ml-auto" @click="validarFormulario"
        >Agregar Más</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import CustomAutocomplete from "../customAutocomplete.vue";
export default {
  name: "SeccionCliente",
  components: {
    CustomAutocomplete,
  },
  props: {
    isPricing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showNombreCompleto: true,
      telefonoErrors: "",
      correoErrors: "",
      correoConvenioActualErrors: "",
      isAutocompleteLoading: false,
      fileinput: null,
      isFileLoading: false,
      isNombreLoading: false,
      isDocumentoLoading: false,
    };
  },
  computed: {
    isNroDocumentoDisabled() {
      return !this.$store.state.entities.cliente.id_tipodocumento;
    },
    isFormReadonly() {
      return this.$store.state.entities.isReadonly;
    },
    showFormActions() {
      return !this.$store.state.entities.isReadonly;
    },
    showNavigationButtons() {
      return !(
        this.$store.state.entities.isEdit ||
        this.$store.state.entities.isReadonly
      );
    },
  },
  methods: {
    ...mapActions([
      "_getState",
      "cargarClientes",
      "validarNombreCliente",
      "validarDocumentoCliente",
      "_uploadFile",
    ]),
    setDocumentoFiscalByDefault(criterio = "") {
      var vm = this;

      const tipoDocumento = vm.getIDTipoDocumento(criterio);
      if (tipoDocumento) {
        vm.$store.state.entities.cliente.id_tipodocumento = tipoDocumento;
      }
    },
    getIDTipoDocumento(criterio = "") {
      var vm = this;
      var id = null;

      const tipoDocumentoData = vm.$store.state.itemsDocumentsPais.find(
        (v) => v.name.toUpperCase() == criterio.toUpperCase()
      );
      if (tipoDocumentoData) {
        id = tipoDocumentoData.id;
      }

      return id;
    },
    toggleNombre() {
      var vm = this;

      const tipoPersonaData =
        vm.$store.state.masterusuarios.lstTipoPersona.find(
          (v) => v.id == vm.$store.state.entities.cliente.id_tipopersona
        );
      if (tipoPersonaData) {
        if (tipoPersonaData.descripcion == "Persona Natural") {
          vm.showNombreCompleto = true;
          vm.setDocumentoFiscalByDefault("DNI");
        } else if (tipoPersonaData.descripcion == "Empresa") {
          vm.showNombreCompleto = false;
          vm.setDocumentoFiscalByDefault("RUC");
        }
      }
    },
    async handleNombre(val) {
      var vm = this;

      vm.$store.state.entities.lstProveedores_x_nombre = [];
      vm.$store.state.entities.cliente.nombrecompleto = val;
      if (vm.$store.state.entities.cliente.nombrecompleto) {
        vm.isNombreLoading = true;
        await this.validarNombreCliente();
        vm.isNombreLoading = false;
      }
    },
    async handleDocumento(val) {
      var vm = this;

      vm.$store.state.entities.lstProveedores_x_documento = [];
      vm.$store.state.entities.cliente.nro_documento = val;
      if (vm.$store.state.entities.cliente.nro_documento) {
        vm.isDocumentoLoading = true;
        await this.validarDocumentoCliente();
        vm.isDocumentoLoading = false;
      }
    },
    async handleEditarCliente(val) {
      if (val) {
        if (!this.isPricing) {
          this.$swal({
            icon: "question",
            html: "<b>¿Desea cargar los datos del cliente seleccionado?</b>",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: "No",
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({
                name: "editarCliente",
                params: { id: val },
              });

              setTimeout(() => window.location.reload(), 10);
            }
          });
        } else {
          this.$swal({
            icon: "question",
            html: "<b>¿Desea cargar los datos del cliente seleccionado?</b>",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: "No",
          }).then((result) => {
            if (result.isConfirmed) {
              let item =
                this.$store.state.entities.lstProveedores_x_nombre.filter(
                  (v) => v.id == val
                )[0];
              this.$store.state.pricing.datosPrincipales.id_entitie = item.id;
              this.$store.state.pricing.datosPrincipales.nombre =
                item.nombrecompleto;
              this.$store.state.pricing.datosPrincipales.telefono =
                item.telefono;
              this.$store.state.modalEntitie = false;
              this.$store.state.registroClienteFlag =
                !this.$store.state.registroClienteFlag;
              // setTimeout(() => window.location.reload(), 10);
            }
          });
        }
      }
    },
    validarCorreoElectronico(v) {
      if (
        v &&
        !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        )
      ) {
        return "Debe ingresar un correo electrónico válido";
      }

      return true;
    },
    validarConvenioActual() {
      var vm = this;
      const { convenioActual } = vm.$store.state.entities.cliente;
      if (convenioActual.dias_credito > 0) {
        if (!convenioActual.fecha) {
          vm.$swal({
            icon: "info",
            text: "Si desea agregar como convenio actual, es necesario llenar la fecha del convenio",
          });
        } else {
          if (
            vm.$store.state.entities.lstConvenios.indexOf(convenioActual) === -1
          ) {
            vm.$store.state.entities.lstConvenios.push(convenioActual);
          }
        }
      }
    },
    validarTelefonoActual() {
      var vm = this;
      const { telefonoActual } = vm.$store.state.entities.cliente;
      if (telefonoActual.id_tipotelefono && telefonoActual.telefono) {
        const index = vm.$store.state.entities.lstTelefonos.findIndex(
          (v) =>
            v.id_tipotelefono == telefonoActual.id_tipotelefono &&
            v.telefono == telefonoActual.telefono
        );
        if (index === -1) {
          vm.$store.state.entities.lstTelefonos.push(telefonoActual);
        }
      }
    },
    validarContactoActual() {
      var vm = this;
      const { contactoActual } = vm.$store.state.entities.cliente;
      if (
        contactoActual.nombre &&
        contactoActual.id_tipotelefono &&
        contactoActual.telefono
      ) {
        const index = vm.$store.state.entities.lstContactos.findIndex(
          (v) =>
            v.nombre == contactoActual.nombre &&
            v.id_tipotelefono == contactoActual.id_tipotelefono &&
            v.telefono == contactoActual.telefono
        );
        if (index === -1) {
          vm.$store.state.entities.lstContactos.push(contactoActual);
        }
      }
    },
    async subirArchivoConvenio() {
      var vm = this;

      if (vm.fileinput) {
        vm.isFileLoading = true;
        await vm._uploadFile(vm.fileinput);
        vm.isFileLoading = false;

        if (vm.$store.state.files.payPath) {
          vm.$swal({
            icon: "success",
            text: "Archivo cargado",
          });

          vm.$store.state.entities.lstConvenios.map((item) => {
            if (item.id == vm.$store.state.entities.cliente.convenioActual.id) {
              item["id_path"] = vm.$store.state.files.payPath;
            }

            return item;
          });
        } else {
          vm.$swal({
            icon: "error",
            text: "Comuníquese con el administrador",
          });
        }
      }
    },
    validarFormulario() {
      var vm = this;
      if (vm.$refs.formDatosCliente.validate()) {
        vm.validarConvenioActual();
        vm.validarTelefonoActual();
        vm.validarContactoActual();

        vm.$store.state.entities.stepper = 2;
      }
    },
  },
  async mounted() {
    await this.cargarClientes();
  },
  watch: {
    "$store.state.entities.isStep1Valid": {
      handler(newValue) {
        if (!newValue) {
          this.$refs.formDatosCliente.validate();
        }
      },
      immediate: true,
    },
  },
  isPricing() {
    console.log("isPricing", this.isPricing);
  },
};
</script>

<style>
.customFile {
  flex-grow: 0 !important;
  flex-direction: row-reverse !important;
}
.customFile .v-input__prepend-outer {
  margin-right: 0;
}
</style>
