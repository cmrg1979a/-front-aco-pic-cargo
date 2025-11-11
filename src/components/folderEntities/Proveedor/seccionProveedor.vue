<template>
  <v-card>
    <v-card-text>
      <v-form ref="formProv_datosProveedor" :readonly="isFormReadonly">
        <v-row>
          <v-col cols="12">
            <!--<v-row>
              <v-col cols="12">
                <v-text-field dense label="Nombre Comercial o Razón Social" :rules="[
                  (v) => !!v || 'Dato Requerido',
                  (v) => (v && v.length >= 3) || 'Debe tener al menos 3 caracteres'
                ]" v-model="$store.state.entities.proveedor.nombrecompleto"></v-text-field>
              </v-col>
            </v-row>-->

            <!--CUSTOM AUTOCOMPLETE-->
            <v-row>
              <v-col cols="12">
                <CustomAutocomplete
                  :items="$store.state.entities.lstProveedores_x_nombre"
                  label="Nombre Comercial o Razón Social"
                  :value="$store.state.entities.proveedor.nombrecompleto"
                  v-on:search="handleNombre"
                  v-on:id="handleEditarProveedor"
                  :loading="isNombreLoading"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  :disabled="false"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  :items="$store.state.itemsDataRoleList"
                  item-text="name"
                  item-value="id"
                  label="Tipo de Proveedor"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.proveedor.id_tipoproveedor"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoTransaccion"
                  item-text="descripcion"
                  item-value="id"
                  label="Nacional / Extranjero"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.proveedor.id_tipotransaccion"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  :items="$store.state.itemsDocumentsPais"
                  item-text="description"
                  item-value="id"
                  label="Tipo de Documento Fiscal"
                  v-model="$store.state.entities.proveedor.id_tipodocumento"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <!--<v-text-field 
                  dense 
                  label="Nro De Documento" 
                  v-model="$store.state.entities.proveedor.nro_documento"
                  :disabled="isNroDocumentoDisabled"
                ></v-text-field>-->
                <CustomAutocomplete
                  :items="$store.state.entities.lstProveedores_x_documento"
                  label="Nro De Documento"
                  :value="$store.state.entities.proveedor.nro_documento"
                  v-on:search="handleDocumento"
                  v-on:id="handleEditarProveedor"
                  :loading="isDocumentoLoading"
                  :disabled="isNroDocumentoDisabled"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  item-text="name"
                  item-value="id"
                  :items="$store.state.itemsPais"
                  label="País"
                  @change="_getState($store.state.entities.proveedor.id_pais)"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                  v-model="$store.state.entities.proveedor.id_pais"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  :items="$store.state.itemsState"
                  item-text="name"
                  item-value="id"
                  label="Región / Estado"
                  v-model="$store.state.entities.proveedor.id_ciudad"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Dirección"
                  v-model="$store.state.entities.proveedor.direccion"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  label="Correo Electrónico"
                  v-model="$store.state.entities.proveedor.emailaddress"
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
              <v-col cols="4">
                <v-text-field
                  dense
                  type="number"
                  suffix="días"
                  v-model="
                    $store.state.entities.proveedor.convenioActual.dias_credito
                  "
                  label="Días de Crédito para el Pago"
                  :rules="[
                    (v) => v >= 0 || 'Debe ser un número entero positivo',
                  ]"
                  @change="validarConvenioActual"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  dense
                  type="date"
                  v-model="$store.state.entities.proveedor.convenioActual.fecha"
                  label="Fecha Convenio"
                  @change="validarConvenioActual"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  dense
                  v-model="
                    $store.state.entities.proveedor.convenioActual.email_soporte
                  "
                  label="Email Soporte"
                  :rules="[(v) => validarCorreoElectronico(v)]"
                  :error-messages="correoConvenioActualErrors"
                  @change="validarConvenioActual"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--TELÉFONO ACTUAL-->
            <v-subheader class="px-0">Teléfono</v-subheader>
            <v-row class="pl-5">
              <v-col cols="6">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoTelefono"
                  item-text="descripcion"
                  item-value="id"
                  label="Tipo de Teléfono"
                  v-model="
                    $store.state.entities.proveedor.telefonoActual
                      .id_tipotelefono
                  "
                  @change="validarTelefonoActual"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  dense
                  label="Teléfono"
                  v-model="
                    $store.state.entities.proveedor.telefonoActual.telefono
                  "
                  @change="validarTelefonoActual"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--CONTACTO ACTUAL-->
            <v-subheader class="px-0">Contacto</v-subheader>
            <v-row class="pl-5">
              <v-col cols="4">
                <v-text-field
                  dense
                  label="Nombre"
                  v-model="
                    $store.state.entities.proveedor.contactoActual.nombre
                  "
                  @change="validarContactoActual"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  dense
                  :items="$store.state.masterusuarios.lstTipoTelefono"
                  item-text="descripcion"
                  item-value="id"
                  label="Tipo de Teléfono"
                  v-model="
                    $store.state.entities.proveedor.contactoActual
                      .id_tipotelefono
                  "
                  @change="validarContactoActual"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  dense
                  label="Teléfono"
                  v-model="
                    $store.state.entities.proveedor.contactoActual.telefono
                  "
                  @change="validarContactoActual"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--PRODUCTO QUE VENDE-->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  textarea
                  label="Producto que vende"
                  :rules="[(v) => validarProducto(v)]"
                  :error-messages="productoErrors"
                  v-model="$store.state.entities.proveedor.producto"
                  :disabled="isProductoDisabled"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--DÍAS LIBRES DE SOBREESTADÍA-->
            <v-row v-show="showDiasSobreestadia">
              <v-col cols="6">
                <v-text-field
                  dense
                  type="number"
                  label="Días Libres de Sobreestadía"
                  :rules="[
                    (v) => v >= 0 || 'Debe ser un número entero positivo',
                  ]"
                  v-model="$store.state.entities.proveedor.dias_sobreestadia"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--DÍAS LIBRES DE ALMACENAJE-->
            <v-row v-show="showDiasAlmacenaje">
              <v-col cols="6">
                <v-text-field
                  dense
                  type="number"
                  label="Días Libres de Almacenaje"
                  :rules="[
                    (v) => v >= 0 || 'Debe ser un número entero positivo',
                  ]"
                  v-model="$store.state.entities.proveedor.dias_almacenaje"
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
                  v-model="$store.state.entities.proveedor.notas"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions v-if="showNavigationButtons">
      <v-btn color="primary" class="ml-auto" @click="validarFormulario"
        >Continuar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import CustomAutocomplete from "../customAutocomplete.vue";
export default {
  name: "SeccionProveedor",
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
      showNombreFiscal: false,
      telefonoErrors: "",
      correoErrors: "",
      correoConvenioActualErrors: "",
      productoErrors: "",
      isAutocompleteLoading: false,
      fileinput: null,
      isFileLoading: false,
      isNombreLoading: false,
      isDocumentoLoading: false,
    };
  },
  computed: {
    isNroDocumentoDisabled() {
      return !this.$store.state.entities.proveedor.id_tipodocumento;
    },
    isProductoDisabled() {
      return !this.isShipper();
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
    showDiasSobreestadia() {
      return this.isNaviera();
    },
    showDiasAlmacenaje() {
      return this.isAlmacen();
    },
  },
  methods: {
    ...mapActions([
      "_getState",
      "cargarClientes",
      "validarNombreProveedor",
      "validarDocumentoProveedor",
      "_uploadFile",
    ]),
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
    async handleNombre(val) {
      var vm = this;

      vm.$store.state.entities.lstProveedores_x_nombre = [];
      vm.$store.state.entities.proveedor.nombrecompleto = val;
      if (vm.$store.state.entities.proveedor.nombrecompleto) {
        vm.isNombreLoading = true;
        await this.validarNombreProveedor();
        vm.isNombreLoading = false;
      }
    },
    async handleDocumento(val) {
      var vm = this;

      vm.$store.state.entities.lstProveedores_x_documento = [];
      vm.$store.state.entities.proveedor.nro_documento = val;
      if (vm.$store.state.entities.proveedor.nro_documento) {
        vm.isDocumentoLoading = true;
        await this.validarDocumentoProveedor();
        vm.isDocumentoLoading = false;
      }
    },
    async handleEditarProveedor(val) {
      if (val) {
        this.$swal({
          icon: "question",
          html: "<b>¿Desea cargar los datos del proveedor seleccionado?</b>",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            if (!this.isPricing) {
              this.$router.push({
                name: "editarProveedor",
                params: { id: val },
              });

              setTimeout(() => window.location.reload(), 10);
            } else {
              
              this.$emit("ObtenerProveedor", val);
            }
          }
        });
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
    validarProducto(v) {
      var vm = this;
      if (vm.isShipper() && !v) {
        return "Dato Requerido";
      }

      return true;
    },
    validarConvenioActual() {
      var vm = this;
      const { convenioActual } = vm.$store.state.entities.proveedor;
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
      const { telefonoActual } = vm.$store.state.entities.proveedor;
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
      const { contactoActual } = vm.$store.state.entities.proveedor;
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
            if (
              item.id == vm.$store.state.entities.proveedor.convenioActual.id
            ) {
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
      if (vm.$refs.formProv_datosProveedor.validate()) {
        vm.validarConvenioActual();
        vm.validarTelefonoActual();
        vm.validarContactoActual();

        vm.$store.state.entities.stepper = 2;
      }
    },
  },
  async mounted() {
    await this.cargarClientes();
    console.log("isPricing", this.isPricing);
  },
  watch: {
    "$store.state.entities.isStep1Valid": {
      handler(newValue) {
        if (!newValue) {
          this.$refs.formProv_datosProveedor.validate();
        }
      },
      immediate: true,
    },
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
