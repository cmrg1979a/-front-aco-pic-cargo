import axios from "axios";
import Swal from "sweetalert2";

const state = {};
const mutations = {};
const actions = {
  async exportReporteFile(__, data) {
    data.id_branch = JSON.parse(sessionStorage.getItem("dataUser"))[0].id_branch;
    Swal.fire({
      icon: "info",
      title: "Generando PDF...",
      text: "Por favor espere",
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    var config = {
      method: "post",
      url: process.env.VUE_APP_URL_MAIN + "createdPDF",
      headers: {
        "auth-token": sessionStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      data: data,
    };
    var vm = this;
    await axios(config)
      .then(function (response) {
        Swal.fire({
          icon: "success",
          title: "PDF Generado",
          text: "El PDF se descargará automaticamente",
          showConfirmButton: true,
        });

        window.open(
          `${process.env.VUE_APP_URL_MAIN}REPORT_CONTROL_FILE.pdf`,
          // "",
          "_blank"
        );
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
