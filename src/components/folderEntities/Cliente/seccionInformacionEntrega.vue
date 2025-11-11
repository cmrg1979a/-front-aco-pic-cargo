<template>
  <v-card>
    <v-card-title>Datos para rótulos en la entrega del producto</v-card-title>
    <v-card-text>
      <v-form ref="formInformacionEntrega" :readonly="isFormReadonly">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Destinatario"
              v-model="$store.state.entities.informacionEntrega.destinatario"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="DNI O RUC"
              v-model="
                $store.state.entities.informacionEntrega.dni_destinatario
              "
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Persona que recoge"
              v-model="$store.state.entities.informacionEntrega.receptor"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="DNI"
              v-model="$store.state.entities.informacionEntrega.dni_receptor"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              dense
              :items="$store.state.itemsState"
              item-text="name"
              item-value="id"
              label="Departamento"
              v-model="$store.state.entities.informacionEntrega.id_departamento"
              @change="
                _getCity(
                  $store.state.entities.informacionEntrega.id_departamento
                )
              "
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              dense
              :items="$store.state.itemsCity"
              item-text="name"
              item-value="id"
              label="Provincia"
              v-model="$store.state.entities.informacionEntrega.id_provincia"
              @change="
                _getTown($store.state.entities.informacionEntrega.id_provincia)
              "
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              dense
              :items="$store.state.itemsTown"
              item-text="name"
              item-value="id"
              label="Distrito"
              v-model="$store.state.entities.informacionEntrega.id_distrito"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Agencia"
              v-model="$store.state.entities.informacionEntrega.agencia"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Celular"
              v-model="$store.state.entities.informacionEntrega.celular_agencia"
              :rules="[(v) => validarTelefono(v)]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Cliente"
              v-model="$store.state.entities.cliente.nombrecompleto"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>

        <!--<v-row>
                  <v-col cols="12" md="6">
                    <div class="d-flex align-center">
                      Estado
                      <v-switch
                        hide-details
                        v-model="$store.state.entities.informacionEntrega.status"
                        class="mt-0 ml-2"
                      ></v-switch>
                    </div>
                  </v-col>
                </v-row>-->
      </v-form>
    </v-card-text>
    <v-card-actions v-if="showNavigationButtons">
      <v-btn color="primary" @click="$store.state.entities.stepper--"
        >Regresar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "SeccionInformacionEntrega",
  data() {
    return {};
  },
  computed: {
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
    ...mapActions(["_getCity", "_getTown"]),
    validarTelefono(v) {
      if (v && !/^\+?\d+$/.test(v)) {
        return "Debe ingresar un teléfono válido";
      }

      return true;
    },
  },
};
</script>
