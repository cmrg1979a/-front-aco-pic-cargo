<template>
  <v-card elevation="0">
    <v-dialog v-model="dialog" v-if="dialog" max-width="30%">
      <v-card>
        <v-card-title primary-title> Nuevo Servicio </v-card-title>
        <v-card-text>
          <v-select
            :items="$store.state.pricing.begEndList"
            v-model="servicio.id_begend"
            item-text="name"
            item-value="id"
            label="Categoria..."
          ></v-select>
          <v-text-field
            label="Descripción"
            v-model="servicio.service"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="guardarServicio()">Guardar</v-btn>
          <v-btn color="red" @click="dialog = !dialog" dark>Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-card-title primary-title>
      SERVICIOS A REALIZAR:
      <v-btn icon color="primary" @click="dialog = !dialog">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-subheader class="mt-0">
      <h4>Desmarque los servicios que NO desea utilizar.</h4>
    </v-subheader>

    <v-card-text>
      <v-row>
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">ORIGEN</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'OR'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.service }}
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">FLETE</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'FL'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.service }}
            </template>
          </v-checkbox></v-col
        >
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">DESTINO</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'DE'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.service }}
            </template>
          </v-checkbox></v-col
        >
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">OPCIONAL</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'OP'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.service }}
            </template>
          </v-checkbox>
          <v-text-field
            prefix="$"
            :error-messages="$store.state.pricing.errorValorMercancia"
            v-model="$store.state.pricing.datosPrincipales.amount"
            label="Valor de la mercancia"
            type="number"
            step="0.10"
            min="0"
            placeholder="Valor de la mercancia..."
            autocomplete="off"
            dense
            v-if="requiereValorMercancia"
            :rules="[
              (v) => !requiereValorMercancia || (!!v && Number(v) > 0) || 'Dato Requerido',
              (v) => !v || /^(?!0\d+|\d*e)\d*(?:\.\d+)?$/.test(v) || 'Debe ser un número real entero positivo',
            ]"
            @input="recargarCostos()"
            @blur="recargarCostos()"
          >
          </v-text-field>
          <v-text-field
            v-model="$store.state.pricing.datosPrincipales.descripcioncarga"
            label="Descripción de carga"
            placeholder="Descripción de carga"
            autocomplete="off"
            dense
          >
          </v-text-field>
        </v-col>
        
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="sticky-actions pa-3">
      <v-spacer></v-spacer>
      <v-btn color="primary" large @click="continuarLlenadoCostos()">
        <v-icon left>mdi-arrow-right-bold</v-icon>
        Continuar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import { mapActions } from "vuex";
export default {
  props: {
    mostrarBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialog: false,
      mostrarContinuarFlag: true,
      servicio: {
        codebegend: "OP",
        id_begend: "0",
        service: "",
        status: true,
      },
    };
  },
  methods: {
    ...mapActions([
      "getItemsServices",
      "getImpuestos",
      "getItemsServicesDetails",
      "getBegEndList",
    ]),
    guardarServicio() {
      let codebegend = this.$store.state.pricing.begEndList.filter(
        (v) => v.id == this.servicio.id_begend
      )[0].code;
      this.servicio.codebegend = codebegend;
      this.$store.state.pricing.listServices.push(this.servicio);
      this.dialog = false;
      this.servicio = {
        codebegend: "OP",
        id_begend: "0",
        service: "",
        status: true,
      };
    },
       logNameService(value) {
    console.log("nameservice:", value); 
     return value;
  },
    recargarCostos() {
      this.$store.state.pricing.errorValorMercancia = "";
      this.$store.state.pricing.actualizarCostosFlag =
        !this.$store.state.pricing.actualizarCostosFlag;
    },
    esImportacion() {
      return this.$store.state.pricing.listModality.some(
        (v) =>
          v.id == this.$store.state.pricing.datosPrincipales.idsentido &&
          v.code == "I"
      );
    },

    continuarLlenadoCostos() {
      if (this.requiereValorMercancia) {
        if (
          !this.$store.state.pricing.datosPrincipales.amount ||
          this.$store.state.pricing.datosPrincipales.amount <= 0
        ) {
          this.$store.state.pricing.errorValorMercancia =
            "Datos Requeridos y mayor que 0";
          return false;
        }
      } else {
        this.$store.state.pricing.errorValorMercancia = "";
      }
      this.$emit("activarLlenadoCostos");
      this.mostrarContinuarFlag = false;
    },
    showConfirmationDialog(service) {
      console.log("******", service);
      const mensajeTransporte =
        "Tarifa no incluye transporte en destino se puede hacer pero necesitamos dirección de entrega";

      const esServicioTransporte =
        (service.service.trim() == 'TRANSPORTE EN DESTINO'.trim());        
      if (esServicioTransporte) {
        
        const opciones = this.$store.state.pricing.opcionCostos || [];

        if (service.status) {          
          // Agregar nota a todas las opciones si no existe
          opciones.forEach((opcion) => {
            if (!Array.isArray(opcion.listNotasQuote)) {
              opcion.listNotasQuote = [];
            }
            const existeNota = opcion.listNotasQuote.some(
              (n) =>
                n.descripcion === mensajeTransporte &&
                !n.statusincluye &&
                !n.statusnoincluye
            );
            if (!existeNota) {
              opcion.listNotasQuote.push({
                descripcion: mensajeTransporte,
                estado: 1,
                statusincluye: 0,
                statusnoincluye: 0,
              });
            }
          });
        } else {
          // Quitar la nota cuando se desactiva el servicio
          opciones.forEach((opcion) => {
            if (Array.isArray(opcion.listNotasQuote)) {
              opcion.listNotasQuote = opcion.listNotasQuote.filter(
                (n) =>
                  !(
                    n.descripcion === mensajeTransporte &&
                    !n.statusincluye &&
                    !n.statusnoincluye
                  )
              );
            }
          });
        }
      }

      this.$emit("recargarCostos");
      if (!this.requiereValorMercancia) {
        this.$store.state.pricing.errorValorMercancia = "";
      }
    },
  },
  computed: {
    requiereValorMercancia() {
      const services = this.$store.state.pricing.listServices || [];
      const normalize = (str) =>
        String(str || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      // Palabras clave: Seguro, Impuesto(s), Almacén Aduanero (con o sin acento)
      const keywords = [
        "seguro",
        "impuesto",
        "impuestos",
        "almacen",
        "almacen aduanero",
      ];
      return services.some((s) => {
        if (!s) return false;
        const checked = s.status === true || s.status === 1;
        if (!checked) return false;
        const name = normalize(s.service);
        return keywords.some((k) => name.includes(k));
      });
    },
    
    agregarNotaServicioDesmarcado(service) {
      // Obtener servicios desmarcados
      const serviciosDesmarcados = this.$store.state.pricing.listServices.filter(
        (s) => !s.status
      );
      
      // Crear el texto de la nota
      let textoNota = "Se puede realizar el transporte, pero se necesitan datos adicionales para los siguientes servicios:\n\n";
      serviciosDesmarcados.forEach((s) => {
        const categoria = this.obtenerNombreCategoria(s.codebegend);
        textoNota += `• ${s.service} (${categoria})\n`;
      });
      
      // Buscar si ya existe una nota automática de servicios desmarcados
      const notaExistente = this.$store.state.pricing.listNotasQuote.find(
        (nota) => nota.esNotaAutomatica === true
      );
      
      if (notaExistente) {
        // Actualizar la nota existente
        notaExistente.name = textoNota;
        notaExistente.descripcion = textoNota;
      } else {
        // Crear una nueva nota
        const nuevaNota = {
          id: `auto_${Date.now()}`, // ID temporal único
          name: textoNota,
          descripcion: textoNota,
          estado: 1, // Activa
          statusincluye: 1, // Se incluye en la cotización
          statusnoincluye: 0,
          esNotaAutomatica: true, // Flag para identificar notas automáticas
          created_at: new Date().toISOString(),
        };
        
        // Agregar la nota al principio de la lista
        this.$store.state.pricing.listNotasQuote.unshift(nuevaNota);
      }
      
      // Actualizar el flag para refrescar las notas en otros componentes
      this.$store.state.pricing.actualizarNotas = !this.$store.state.pricing.actualizarNotas;
    },
    
    eliminarNotaServicioDesmarcado(service) {
      // Verificar si aún hay servicios desmarcados
      const serviciosDesmarcados = this.$store.state.pricing.listServices.filter(
        (s) => !s.status
      );
      
      if (serviciosDesmarcados.length === 0) {
        // Si no hay servicios desmarcados, eliminar la nota automática
        const indiceNota = this.$store.state.pricing.listNotasQuote.findIndex(
          (nota) => nota.esNotaAutomatica === true
        );
        
        if (indiceNota !== -1) {
          this.$store.state.pricing.listNotasQuote.splice(indiceNota, 1);
          this.$store.state.pricing.actualizarNotas = !this.$store.state.pricing.actualizarNotas;
        }
      } else {
        // Si aún hay servicios desmarcados, actualizar la nota
        this.agregarNotaServicioDesmarcado(service);
      }
    },
    
    obtenerNombreCategoria(code) {
      const categorias = {
        'OR': 'Origen',
        'FL': 'Flete',
        'DE': 'Destino',
        'OP': 'Opcional'
      };
      return categorias[code] || code;
    },
  },
};
</script>

<style scoped>
.sticky-actions {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #eee;
  z-index: 2;
}
</style>
