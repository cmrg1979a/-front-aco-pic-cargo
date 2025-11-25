<template>
  <div style="min-height: 620px">
    <h3>Estatus del embarque</h3>

    <v-container style="padding: 0">
      <v-row>
        <v-col cols="12">
          <v-simple-table dense fixed-header height="400px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Grupo</th>
                  <th class="text-left">Nombre</th>
                  <th class="text-left">Comentario</th>
                  <th class="text-left">Fecha</th>
                  <th class="text-left">Visible/No Visible</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in $store.state.itemsBitacora" :key="item.id">
                  <td>{{ item.namemodule }}</td>
                  <td>{{ item.namebitacora }}</td>
                  <td>{{ item.comentario }}</td>
                  <td>{{ item.date }}</td>
                  <td>
                    <v-switch
                      dense
                      readonly
                      color="primary"
                      v-model="item.visible_cliente"
                      @click="_changeStatusVisibleBitacora(item)"
                      :disabled="isFormActionsDisabled"
                    ></v-switch>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>

  
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "bitacora",
  props: {
    isFormActionsDisabled: Boolean,
  },
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    loadingBotonBitacora: false,
    loadingBotonTracking: false,
    disabledBotonBitacora: false,
  }),
  computed: {
    isBotonTrackingDisabled: function () {
      return this.$store.state.house_enlace_tracking !== "" &&
        this.$store.state.house_enlace_tracking !== null
        ? true
        : this.isFormActionsDisabled;
    },
    isBotonBitacoraDisabled: function () {
      return this.isFormActionsDisabled || this.disabledBotonBitacora;
    },
  },
  async mounted() {
    // await this._getBitacoraLineal();
    await this._getComentariosPredefinidos();
    await this._getHouseBitacora().then(() => {
      this._setDefaultBitacora();
    });
  },
  methods: {
    ...mapActions([
      "_getBitacoraLineal",
      "_getHouseBitacora",
      "_getComentariosPredefinidos",
    ]),
    ObtenerComentariosPredifinidos() {
      let comentarios = [];
      // console.log("itemsBitacora", this.$store.state.itemsBitacora);
      // console.log(
      //   "itemsC omentariosPredefinidos",
      //   this.$store.state.itemsComentariosPredefinidos
      // );
      this.$store.state.itemsComentariosPredefinidos.forEach((element) => {
        element.comentariousuado = this.$store.state.itemsBitacora.some(
          (v) => v.comentario === element.comentario
        );
        comentarios.push(element);
      });
      return comentarios;
    },
    cleanData() {
      this.$store.state.bitacora_id_bitacora = "";
      this.$store.state.bitacora_comentario_predefinido = "";
      this.$store.state.bitacora_comentario_flag = false;
      this.$store.state.bitacora_comentario = "";
      this.$store.state.bitacora_visible_cliente = true;
    },
    _validaData() {
      var vm = this;
      if (vm.$route.params.id) {
        // vm._getBitacoraLineal();
      }
    },
    async _deleteBitacora(id) {
      var vm = this;
      var data = {
        id: id,
      };

      var config = {
        method: "post",
        url: process.env.VUE_APP_URL_MAIN + "deleteBitacora",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(async function (response) {
          sessionStorage.setItem("auth-token", response.data.token);
          if (response.data.status == 200) {
            await vm._getHouseBitacora().then(() => {
              vm._setDefaultBitacora();
            });
          }

          if (response.data.status == "401") {
            Swal.fire({
              icon: "error",
              text: response.data.mensaje,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            }).then((resSwal) => {
              if (resSwal.isConfirmed && response.data.status == "401") {
                router.push({ name: "Login" });
                setTimeout(() => {
                  window.location.reload();
                }, 10);
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async _changeStatusBitacora({ id, status }) {
      var vm = this;
      var data = {
        id: id,
        status: status,
      };

      var config = {
        method: "put",
        url: process.env.VUE_APP_URL_MAIN + "changeStatusBitacora",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(async function (response) {
          sessionStorage.setItem("auth-token", response.data.token);
          if (response.data.status == 200) {
            await vm._getHouseBitacora();
          }

          if (response.data.status == "401") {
            Swal.fire({
              icon: "error",
              text: response.data.mensaje,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            }).then((resSwal) => {
              if (resSwal.isConfirmed && response.data.status == "401") {
                router.push({ name: "Login" });
                setTimeout(() => {
                  window.location.reload();
                }, 10);
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async _changeStatusVisibleBitacora({ id, visible_cliente }) {
      var vm = this;
      var data = {
        id: id,
        visible: visible_cliente,
      };

      var config = {
        method: "put",
        url: process.env.VUE_APP_URL_MAIN + "changeStatusVisibleBitacora",
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(async function (response) {
          // console.log(response);
          sessionStorage.setItem("auth-token", response.data.token);
          if (response.data.status == 200) {
            await vm._getHouseBitacora();
          }

          if (response.data.status == "401") {
            Swal.fire({
              icon: "error",
              text: response.data.mensaje,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            }).then((resSwal) => {
              if (resSwal.isConfirmed && response.data.status == "401") {
                router.push({ name: "Login" });
                setTimeout(() => {
                  window.location.reload();
                }, 10);
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    _setDefaultBitacora() {
      var vm = this;
      vm.disabledBotonBitacora = false;
      if (!vm.$store.state.itemsBitacora.length) {
        vm.$store.state.bitacora_id_bitacora = 1;
      } else {
        if (
          vm.$store.state.itemsBitacora.length <
          vm.$store.state.itemsBitacoraLineal.length
        ) {
          const dataUltimaBitacora =
            vm.$store.state.itemsBitacora[
              vm.$store.state.itemsBitacora.length - 1
            ];
          if (Object.keys(dataUltimaBitacora).length) {
            vm.$store.state.bitacora_id_bitacora =
              dataUltimaBitacora.id_bitacora + 1;
          }
        } else {
          vm.disabledBotonBitacora = true;
        }
      }
    },
    _handleFlagComentarioManual() {
      if (this.$store.state.bitacora_comentario_flag) {
        this.$store.state.bitacora_comentario_predefinido = null;
      }
    },
    async _setBitacora() {
      var vm = this;

      if (!vm.$store.state.bitacora_id_bitacora) {
        vm.$swal("", "¡La bitacora es requerida!", "error");
      } else {
        var ok = true;
        if (vm.$store.state.itemsBitacora.length) {
          const dataUltimaBitacora =
            vm.$store.state.itemsBitacora[
              vm.$store.state.itemsBitacora.length - 1
            ];
          if (
            vm.$store.state.bitacora_id_bitacora !=
            dataUltimaBitacora.id_bitacora + 1
          ) {
            ok = false;
          }
        } else {
          if (vm.$store.state.bitacora_id_bitacora != 1) {
            ok = false;
          }
        }

        if (!ok) {
          vm.$swal(
            "",
            "¡Debe registrar las bitácoras en el orden que aparecen en la lista!",
            "error"
          );
        } else if (
          vm.$store.state.bitacora_comentario_flag &&
          !vm.$store.state.bitacora_comentario
        ) {
          vm.$swal("", "¡El comentario es requerido!", "error");
        } else {
          vm.loadingBotonBitacora = !vm.loadingBotonBitacora;

          var data = {
            id_house: vm.$route.params.id,
            id_bitacora: vm.$store.state.bitacora_id_bitacora,
            id_comentario: !vm.$store.state.bitacora_comentario_flag
              ? vm.$store.state.bitacora_comentario_predefinido
              : "",
            comentario: vm.$store.state.bitacora_comentario_flag
              ? vm.$store.state.bitacora_comentario
              : "",
            fecha: vm.$store.state.bitacora_fecha,
            visible_cliente: vm.$store.state.bitacora_visible_cliente,
          };

          var config = {
            method: "post",
            url: process.env.VUE_APP_URL_MAIN + "setBitacora",
            headers: {
              "auth-token": sessionStorage.getItem("auth-token"),
              "Content-Type": "application/json",
            },
            data: data,
          };

          await axios(config)
            .then(async function (response) {
              sessionStorage.setItem("auth-token", response.data.token);
              if (response.data.status == 200) {
                await vm._getHouseBitacora().then(() => {
                  vm.cleanData();
                  vm._setDefaultBitacora();
                });
              }

              if (response.data.status == "401") {
                Swal.fire({
                  icon: "error",
                  text: response.data.mensaje,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                }).then((resSwal) => {
                  if (resSwal.isConfirmed && response.data.status == "401") {
                    router.push({ name: "Login" });
                    setTimeout(() => {
                      window.location.reload();
                    }, 10);
                  }
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            })
            .finally(function () {
              vm.loadingBotonBitacora = !vm.loadingBotonBitacora;
            });
        }
      }
    },
    async _generateTrackingToken() {
      const token = uuidv4();

      this.loadingBotonTracking = !this.loadingBotonTracking;
      await this._setTrackingToken(token);
      this.loadingBotonTracking = !this.loadingBotonTracking;
    },
    async _setTrackingToken(token) {
      var vm = this;

      var data = {
        id_house: vm.$route.params.id,
        token: token,
        fecha: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      };

      var config = {
        method: "put",
        url: process.env.VUE_APP_URL_MAIN + `setTrackingToken`,
        headers: {
          "auth-token": sessionStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          // console.log(response);
          sessionStorage.setItem("auth-token", response.data.token);

          if (response.data.estadoflag) {
            vm.$store.state.house_enlace_tracking =
              "https://aco.agentedecargaonline.com/tracking/" +
              response.data.data[0].token;
          } else {
            Swal.fire({
              icon: response.data.status == "401" ? "error" : "info",
              text: response.data.mensaje,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            }).then((resSwal) => {
              if (resSwal.isConfirmed && response.data.status == "401") {
                router.push({ name: "Login" });
                setTimeout(() => {
                  window.location.reload();
                }, 10);
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async _copyEnlaceTracking(texto) {
      await navigator.clipboard.writeText(texto);
    },
  },
};
</script>

<style lang="scss" scoped>
.dataBitacora {
  max-height: 430px;
  overflow-y: scroll;
}

.btn_add {
  cursor: pointer;
}
.comentarioUtilizado {
  background: #e8eaf6;
}
</style>
