<template>
  <v-card>
    <v-container>
      <v-tabs
        v-model="model"
        centered
        dark
        background-color="teal darken-3"
        show-arrows
      >
        <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
        <v-tab key="principal">Datos Principales</v-tab>
        <v-tab key="xxx">Costos</v-tab>
      </v-tabs>
      <v-tabs-items v-model="model" class="mt-3">
        <v-tab-item key="principal">
          <v-row>
            <v-col cols="6">
              <v-text-field
                name="Cliente"
                label="Cliente"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Teléfono"
                label="Teléfono"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Email"
                label="Email"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Origen"
                label="Origen"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Destino"
                label="Destino"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Peso"
                label="Peso"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Volumen"
                label="Volumen"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="ValorMercancia"
                label="Valor Mercancia"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                name="Profit"
                label="Profit"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item key="costos"> Costos </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      model: "principal",
      cotizacion: {},
    };
  },
};
</script>

<style></style>
