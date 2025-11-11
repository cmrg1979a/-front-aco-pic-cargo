<template>
  <div>
    <div class="_main_avatar__login"></div>
    <p class="_title__User">Bienvenid{{ acronynO }} {{ nameUser }}</p>
  </div>
</template>
<script>
export default {
  name: "formWelcome",
  data() {
    return {
      nameUser: "",
      acronynO: "o",
      imagePath: "",
    };
  },
  mounted() {
    this._proccessName();
  },
  methods: {
    _proccessName() {
      var vm = this;
      var dataUser = JSON.parse(sessionStorage.getItem("dataUser"));
      var namelong = dataUser[0].names.split(" ");
      vm.nameUser = namelong[0].nombrecompleto;
      vm.imagePath = dataUser[0].path;

      if (dataUser[0].id_sex == 1) {
        vm.acronynO = "o";
      } else {
        vm.acronynO = "a";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
._main_avatar__login {
  img {
    width: 15vw;
    height: auto;

    @media (max-width: 800px) {
      width: 45vw;
    }
  }
}
._title__User {
  padding-top: 20px;
  font-size: 2.5vw;

  @media (max-width: 800px) {
    font-size: 6vw;
  }
}
</style>
