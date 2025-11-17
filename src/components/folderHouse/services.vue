<template>
  <div>
    <p>{{ selected_certificado }}</p>
    <h3>Servicios a Realizar</h3>

    <v-fab-transition>
      <v-btn
        @click="showModalServices"
        color="green"
        absolute
        top
        right
        small
        fab
        :dark="!isFormActionsDisabled"
        :disabled="isFormActionsDisabled"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-simple-table fixed-header height="605px" dense>
      <template v-slot:default>
        <thead>
          <tr>
            <!-- <th width="25%" class="text-left">Ubicación/Tramo</th> -->
            <th width="45%" class="text-left">Servicio</th>
            <th width="25%" class="text-center">Realizado (Sí/No)</th>
            <th width="5%" class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :style="`background:${item.color}`"
            v-for="(item, index) in $store.state.itemsHouseServices"
            :key="item.id"
          >
            <!-- <td>{{ item.namebegend }}</td> -->
            <td>{{ item.nameservice }}</td>

            <td>
              <div class="d-flex justify-center">
                <v-switch
                  v-if="item.nameservice != 'CERTIFICADO DE ORIGEN'"
                  dense
                  color="primary"
                  v-model="item.status"
                  :disabled="getDisabledPropServiceStatus(index)"
                  @change="toggleServiceStatusSwitch(item, index)"
                ></v-switch>
              </div>

              <v-menu
                v-if="item.nameservice == 'CERTIFICADO DE ORIGEN'"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn large color="default" v-bind="attrs" v-on="on">
                    {{
                      item.status == 1
                        ? "SI"
                        : item.status == 0
                        ? "NO"
                        : item.status == 2
                        ? "NO APLICA"
                        : ""
                    }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="_editServices(item.id, 1)" link>
                    <v-list-item-title>SI</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="_editServices(item.id, 0)" link>
                    <v-list-item-title>NO</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="_editServices(item.id, 2)" link>
                    <v-list-item-title>NO APLICA</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
            <td class="text-center">
              <v-icon
                class="btn_add"
                dense
                color="red"
                @click="deleteService(index)"
                :disabled="isFormActionsDisabled"
                >mdi-delete</v-icon
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- Botón "Imprimir Formato" movido a sección de Acciones en controlHouse.vue -->
  </div>
</template>
<script>
import { mapActions } from "vuex";
import axios from "axios";
import moment from "moment";
export default {
  name: "services",
  props: {
    isFormActionsDisabled: Boolean,
  },
  data: () => ({
    itemsCertificado: [
      { value: 1, text: "Si" },
      { value: 0, text: "No" },
      { value: 2, text: "No Aplica" },
    ],
    selected_certificado: "",
  }),
  computed: {},
  async mounted() {
    await this._validaData();
  },
  methods: {
    ...mapActions([
      "getQuoteDataNoAsignadaHouseByIncoterms",
      "_getPortBegin",
      "_getPortEnd",
    ]),
    getDisabledPropServiceStatus(index) {
      return (index) =>
        index === 0
          ? false
          : !this.$store.state.itemsHouseServices[index - 1].status;
    },
    send() {
      alert("Jpla");
    },
    _deleteServices(id) {
      var vm = this;
      var data = {
        id: id,
      };
      var config = {
        method: "post",
        url: process.env.VUE_APP_URL_MAIN + "deleteServices",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(async function (response) {
          if (response.data.status == 200) {
            await vm._validaData();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    _activeServices(id) {
      var vm = this;
      var data = {
        id: id,
      };
      var config = {
        method: "post",
        url: process.env.VUE_APP_URL_MAIN + "activeServices",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(async function (response) {
          if (response.data.status == 200) {
            await vm._validaData();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    _inactiveServices(id) {
      var vm = this;
      var data = {
        id: id,
      };
      var config = {
        method: "post",
        url: process.env.VUE_APP_URL_MAIN + "inactiveServices",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(async function (response) {
          if (response.data.status == 200) {
            await vm._validaData();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    _editServices(id, status) {
      var vm = this;
      var data = {
        id: id,
        status: status,
      };
      var config = {
        method: "post",
        url: process.env.VUE_APP_URL_MAIN + "editServices",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          if (response.data.status == 200) {
            vm._validaData();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async _validaData() {
      var vm = this;

      if (vm.$route.params.id) {
        vm.$store.state.house_Id_get = vm.$route.params.id;
        var data = {
          id: vm.$route.params.id,
          id_branch: JSON.parse(sessionStorage.getItem("dataUser"))[0]
            .id_branch,
        };

        var config = {
          method: "post",
          url: process.env.VUE_APP_URL_MAIN + "getHouseServices",
          headers: {
            "auth-token": sessionStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config)
          .then(function (response) {
            sessionStorage.setItem("auth-token", response.data.token);

            if (response.data.estadoflag) {
              let lstServices = [];
              let itemImpuestos = null;
              response.data.data.map((item, i) => {
                if (item.nameservice.toUpperCase() == "IMPUESTOS") {
                  itemImpuestos = item;
                } else {
                  lstServices.push(item);
                }
              });

              if (itemImpuestos !== null) {
                lstServices.push(itemImpuestos);
              }

              vm.$store.state.itemsHouseServices = lstServices;
            } else {
              vm.$store.state.itemsHouseServices = [];
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    showModalServices() {
      var vm = this;

      vm.$store.state.modalServices_manualMode = false;
      if (
        (!vm.$store.state.house_cotizacion &&
          !vm.$store.state.itemsHouseServices.length) ||
        (!vm.$store.state.house_incoterms &&
          !vm.$store.state.itemsHouseServices.length)
      ) {
        vm.$swal({
          icon: "question",
          html: "<b>¿Desea asociar una cotización para cargar los servicios?</b>",
          showConfirmButton: true,
          confirmButtonText: "Sí",
          confirmButtonColor: "#4CAF50",
          showDenyButton: true,
          denyButtonText: "No tengo una cotización",
          allowOutsideClick: false,
        }).then(({ isDenied }) => {
          if (isDenied) {
            vm.$swal({
              icon: "info",
              html: "<b>Los servicios se cargarán según el incoterm seleccionado. Si no ha seleccionado un incoterm, seleccione uno para cargar los servicios.</b>",
              showConfirmButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#4CAF50",
              allowOutsideClick: false,
            }).then(async (result) => {
              if (vm.$store.state.house_incoterms) {
                vm.$store.state.spiner = true;

                await vm._getServicesByIncoterms(
                  vm.$store.state.house_sentido,
                  vm.$store.state.house_id_trasnport,
                  vm.$store.state.house_incoterms
                );

                vm.$store.state.spiner = false;
              }
            });
          }
        });
      } else {
        if (vm.$store.state.itemsHouseServices.length) {
          vm.$store.state.modalServices_manualMode = true;
        }
      }
    },
    toggleServiceStatusSwitch(item, index) {
      if (!item.status) {
        this.$store.state.itemsHouseServices =
          this.$store.state.itemsHouseServices.map((itemHS, i) => {
            return {
              ...itemHS,
              status: i > index ? 0 : itemHS.status,
            };
          });
      }
    },
    deleteService(index) {
      this.$store.state.itemsHouseServices.splice(index, 1);
    },
    async _activePort(id_transport) {
      await this._getPortBegin({ id_transport: id_transport });
      await this._getPortEnd({ id_transport: id_transport });
      if (this.$store.state.master_id_trasnport.id == 1) {
        this.$store.state.embar_title_nacn = "Aerolinea";
      } else if (this.$store.state.master_id_trasnport.id == 2) {
        this.$store.state.embar_title_nacn = "Naviera";
      } else if (this.$store.state.master_id_trasnport.id == 3) {
        this.$store.state.embar_title_nacn = "Coloader";
      } else {
        this.$store.state.embar_title_nacn = "Aerolinea/Coloader/Naviera";
      }
    },
    async _getServicesByIncoterms(
      id_modality = 0,
      id_shipment = 0,
      id_incoterms = 0
    ) {
      var vm = this;
      var data = {
        id_branch: JSON.parse(sessionStorage.getItem("dataUser"))[0].id_branch,
        id_modality: id_modality,
        id_shipment: id_shipment,
        id_incoterms: id_incoterms,
      };

      var config = {
        method: "post",
        url: process.env.VUE_APP_URL_MAIN + `getServicesByIncoterms`,
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          sessionStorage.setItem("auth-token", response.data.token);

          if (response.data.estadoflag) {
            let lstServices = [];
            let itemImpuestos = null;

            response.data.data.map((item, i) => {
              const dataService = {
                id_begend: item.id_begend,
                namebegend: item.namebegend,
                position_begend: item.position_begend,
                nameservice: item.namegroupservice,
                status: 0,
              };

              if (item.namegroupservice.toUpperCase() == "IMPUESTOS") {
                itemImpuestos = dataService;
              } else {
                lstServices.push(dataService);
              }
            });

            if (itemImpuestos !== null) {
              lstServices.push(itemImpuestos);
            }

            vm.$store.state.itemsHouseServices = lstServices;
          } else {
            vm.$store.state.itemsHouseServices = [];

            vm.$swal({
              icon: "error",
              text: response.data.mensaje,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.listMain {
  padding: 0px;
}

.btn_add {
  cursor: pointer;
}
</style>
