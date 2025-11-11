import axios from "axios";
import Swal from "sweetalert2";
// import funciones from "./../../mixins/funciones";
const state = {
  listHouse: [],
  house: {},
};
const mutations = {
  SET_LIST_HOUSE(state, data) {
    state.listHouse = data;
  },
  SET_VER_HOUSE(state, data) {
    state.house = data;
  },
};
// getCargarHouse
const actions = {
  async verHouse({ commit }, filtros) {
    filtros.id_branch = JSON.parse(
      sessionStorage.getItem("dataUser")
    )[0].id_branch;
    await axios
      .get(process.env.VUE_APP_URL_MAIN + `house_ver`, {
        params: filtros,
        "auth-token": sessionStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      })
      .then(function (response) {
        let data = response.data;
        console.log(data)
        commit("SET_VER_HOUSE", data.data ? data.data[0] : {});
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(state.house);
  },
  async listarHouse({ commit }, filtros) {
    filtros.id_branch = JSON.parse(
      sessionStorage.getItem("dataUser")
    )[0].id_branch;
    await axios
      .get(process.env.VUE_APP_URL_MAIN + `listado_houses`, {
        params: filtros,
        "auth-token": sessionStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      })
      .then(function (response) {
        let data = response.data;
       

        commit("SET_LIST_HOUSE", data.data ? data.data : []);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  async getCargarHouse({ commit }) {
    var config = {
      method: "get",
      url:
        process.env.VUE_APP_URL_MAIN +
        `cargar_house?id_branch=${
          JSON.parse(sessionStorage.getItem("dataUser"))[0].id_branch
        }`,

      headers: {
        "auth-token": sessionStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    };
    await axios(config)
      .then(function (response) {
        let data = response.data;
       

        commit("SET_LIST_HOUSE", data.data ? data.data : []);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  async insertComentarioHouse(__, dataObj = {}) {
    var config = {
      method: "post",
      url: process.env.VUE_APP_URL_MAIN + `insertComentarioHouse`,
      headers: {
        "auth-token": sessionStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      data: dataObj,
    };

    await axios(config)
      .then(function (response) {
        sessionStorage.setItem("auth-token", response.data.token);

        let res = response.data;
        if (res.status == "401") {
          Swal.fire({
            icon: "error",
            text: res.mensaje,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          }).then((resSwal) => {
            if (resSwal.isConfirmed && res.status == "401") {
              router.push({ name: "Login" });
              setTimeout(() => {
                window.location.reload();
              }, 10);
            }
          });
        } else {
          Swal.fire({
            icon: res.estadoflag ? "success" : "error",
            text: res.mensaje,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
export default {
  namespace: true,
  state,
  mutations,
  actions,
};
