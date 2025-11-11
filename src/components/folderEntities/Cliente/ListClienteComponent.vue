<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-btn
          rounded
          small
          class="mx-1"
          color="success"
          @click="cambiarRuta({ nameRuta: 'nuevoClientes' })"
        >
          NUEVO
        </v-btn>
        <v-btn
          rounded
          small
          class="mx-1"
          color="secondary"
          @click="
            $store.state.entities.filtrarProveedor =
              !$store.state.entities.filtrarProveedor
          "
        >
          FILTRAR
        </v-btn>
        <v-btn
          rounded
          small
          class="mx-1"
          color="warning"
          @click="exportCliente()"
          >EXPORTAR</v-btn
        >
      </v-col>
      <v-col cols="6">
        <v-spacer></v-spacer>
        <v-text-field
          name="Buscar"
          label="Buscar"
          v-model="search"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="$store.state.entities.lstProveedor"
          item-key="id"
          :search="search"
        >
          <template v-slot:[`item.documento`]="{ item }">
            {{ item.acronym_document }}-{{ item.document }}
          </template>
          <template v-slot:[`item.ubigeo`]="{ item }">
            {{
              item.pais && item.city
                ? item.pais.concat("-", item.city)
                : item.pais || item.city
            }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn-toggle>
              <v-btn x-small icon @click="obtenerTelContactoProveedor(item)">
                <v-icon color="blue-grey darken-3">mdi-phone</v-icon>
              </v-btn>
              <!-- <v-btn x-small icon @click="editar(item.id)">
                <v-icon color="green">mdi-currency-usd</v-icon>
              </v-btn> -->
              <v-btn
                v-if="item.status == 1"
                x-small
                icon
                @click="
                  $router.push({
                    name: 'editarCliente',
                    params: { id: item.id },
                  })
                "
              >
                <v-icon color="#E65100">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                x-small
                icon
                @click="
                  $router.push({
                    name: 'verCliente',
                    params: { id: item.id },
                  })
                "
              >
                <v-icon color="info">mdi-eye</v-icon>
              </v-btn>
              <v-btn x-small icon v-if="item.status == 1">
                <v-icon color="red" @click="eliminar(item)">mdi-delete</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialogTelCont"
      persistent
      max-width="50%"
      transition="dialog-transition"
      scrollable
    >
      <v-card>
        <v-card-title>
          Teléfonos y Contactos: {{ nombrecompleto }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              <v-subheader> <b>Teléfonos:</b> <br /> </v-subheader>
            </v-col>

            <v-col cols="12">
              <v-data-table
                :headers="headersTel"
                :items="$store.state.entities.lstTelefono"
                item-key="id"
                class="elevation-5"
              >
                <template v-slot:[`item.tipotelefono`]="{ item }">
                  <v-autocomplete
                    :items="$store.state.masterusuarios.lstTipoTelefono"
                    item-text="descripcion"
                    item-value="id"
                    label="Tipo de Teléfono"
                    v-model="item.id_tipotelefono"
                    :error-messages="item.errorTipoTelf"
                    readonly
                  >
                  </v-autocomplete>
                </template>
                <template v-slot:[`item.nro_telefono`]="{ item }">
                  <v-text-field
                    v-model="item.telefono"
                    prefix="+"
                    :error-messages="item.errorTelefono"
                  ></v-text-field>
                </template>
                <template v-slot:[`item.action`]="{ item, index }">
                  <v-btn icon color="red" @click="eliminarTelefono(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>

            <!-- -------------------------------- -->
            <v-col cols="10">
              <v-subheader><b>Contactos</b></v-subheader>
            </v-col>
            <v-col cols="12">
              <v-data-table
                :headers="headersContact"
                :items="$store.state.entities.lstContactos"
                item-key="index"
                class="elevation-5"
              >
                <template v-slot:[`item.nombre`]="{ item }">
                  <v-text-field
                    v-model="item.nombre"
                    readonly
                    :error-messages="item.errornombre"
                  ></v-text-field>
                </template>

                <template v-slot:[`item.tipotelefono`]="{ item }">
                  <v-autocomplete
                    :items="$store.state.masterusuarios.lstTipoTelefono"
                    item-text="descripcion"
                    item-value="id"
                    label="Tipo de Teléfono"
                    v-model="item.id_tipotelefono"
                    readonly
                    :error-messages="item.errorTipoTelf"
                  >
                  </v-autocomplete>
                </template>
                <template v-slot:[`item.nro_telefono`]="{ item }">
                  <v-text-field
                    v-model="item.telefono"
                    prefix="+"
                    :error-messages="item.errorTelefono"
                    v-on:blur="validarFormularioTelefonoContacto()"
                  ></v-text-field>
                </template>

                <template v-slot:[`item.action`]="{ item, index }">
                  <v-btn icon color="red" @click="eliminarContacto(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-1"
            color="success"
            @click="dialogTelCont = !dialogTelCont"
            >Cerrar</v-btn
          >
          <!-- <v-btn class="mx-1" color="red" dark>Cancelar</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      dialogTelCont: false,
      search: "",
      filtroflag: true,
      nombrecompleto: "",
      headers: [
        { text: "Correlativo", value: "correlativo" },
        { text: "Documento", value: "documento" },
        { text: "Nombre Completo", value: "nombrecompleto" },
        { text: "Ubigeo", value: "ubigeo" },
        { text: "Dirección", value: "address" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "action" },
      ],
      headersTel: [
        { text: "Tipo de Teléfono", value: "tipotelefono", width: "30%" },
        { text: "Nro Teléfono", value: "nro_telefono", width: "50%" },
      ],
      headersContact: [
        { text: "Nombres", value: "nombre" },
        { text: "Tipo de Teléfono", value: "tipotelefono" },
        { text: "Nro Teléfono", value: "nro_telefono" },
      ],
    };
  },
  methods: {
    ...mapActions([
      "getListClientes",
      "_getDocumentsPais",
      "cargarMasterDetalleTipoProveedor",
      "_getPais",
      "_getState",
      "_getRole",
      "cambioURL",
      "eliminarPersona",
      "telConctactoProveedor",
      "cargarTipoTelefono",
      "exportListClientes",
    ]),
    cambiarRuta({ nameRuta = "", idProveedor = "" }) {
      this.$router.push({
        name: nameRuta,
        paramas: {
          id: idProveedor,
        },
      });
    },
    eliminar(item) {
      Swal.fire({
        icon: "question",
        title: "Eliminar Registro",
        html: `Está seguro que desea eliminar el CLIENTE <br/> CLI-${item.correlativo}`,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: "ELIMINAR",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonText: "Cerrar",
      }).then(async (res) => {
        if (res.isConfirmed) {
          let data = { id: item.id };
          await this.eliminarPersona(data);
          await this.getListClientes();
        }
      });
    },
    async obtenerTelContactoProveedor(item) {
      this.$store.state.spiner = true;
      this.nombrecompleto = item.nombrecompleto;
      await this.telConctactoProveedor({ id: item.id });
      this.dialogTelCont = true;
      this.$store.state.spiner = false;
    },
    async exportCliente() {
      this.$store.state.spiner = true;
      await this.exportListClientes();
      this.$store.state.spiner = false;
    },
  },
  async mounted() {
    this.$store.state.entities.lstProveedor = [];
    this.$store.state.spiner = true;
    await this.getListClientes();
    this.$store.state.spiner = false;
    await Promise.all([
      this._getDocumentsPais(),
      this.cargarMasterDetalleTipoProveedor(),
      this._getPais(),
      this._getRole(),
      this.cargarTipoTelefono(),
    ]);
  },
};
</script>

<style></style>
