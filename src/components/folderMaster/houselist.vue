<template>
  <div>
    <!-- <v-list three-line> -->
    <template>
      <v-expansion-panels v-model="openExpand">
        <v-expansion-panel>
          <v-expansion-panel-header> LISTA DE HOUSE </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row dense>
              <v-col cols="12" md="3">
                <v-text-field
                  :value="totalHouses"
                  label="Total de House"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  :value="totalPesoHouse"
                  label="Total de House Peso"
                  suffix="kg"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  :value="totalVolumenHouse"
                  label="Total de House Volumen"
                  suffix="m3"
                  readonly
                ></v-text-field>
              </v-col> 
            </v-row>
            <div
              v-if="$store.state.itemsHouseList && $store.state.itemsHouseList.length > 3 && !showAll"
              class="mb-2"
            >
              <v-btn color="info" small @click="showAll = true">Leer más</v-btn>
            </div>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Listado</th>
                    <th>Cliente</th>
                    <th>Incoterm</th>
                    <th>Peso</th>
                    <th>Volumen</th>
                    <th v-if="esAereo">Peso volumétrico</th>
                    <th v-if="esAereo">Peso Cargable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in displayedItems"
                    :key="index"
                    @click="showHouse(item.id)"
                    style="cursor: pointer;"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nro_hbl ? item.nro_hbl : item.code_house }}</td>
                    <td>{{ item.incoterm || item.nameincoterm || item.incoterms || '-' }}</td>
                    <td>{{ item.peso }}</td>
                    <td>{{ item.volumen }}</td>
                    <td v-if="esAereo">{{ computePesoVolumetrico(item) }}</td>
                    <td v-if="esAereo">{{ computePesoCargable(item) }}</td>
                    <td>
                      <v-icon small color="info" @click.stop="showHouse(item.id)">mdi-open-in-new</v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-list-item
              link
              v-for="(item, index) in $store.state.itemsHouseList"
              :key="index"
              @click.native="showHouse(item.id)"
            >
              <v-list-item-avatar>
                <v-avatar color="teal" size="32">
                  <span class="white--text text-h6">{{ index + 1 }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="item.nro_hbl ? item.nro_hbl : item.code_house"
                ></v-list-item-title>
                <v-list-item-subtitle>
                  <!-- Bultos: {{ item.bultos }} | Peso: {{ item.peso }} Kg | Volumen: {{ item.volumen }} m3 -->
                  Cliente:
                  {{ item.cliente_nombre || item.nameconsigner || item.cliente || '-' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <!-- </v-list> -->
  </div>
</template>

<script>
export default {
  name: "houselist",
  computed: {
    displayedItems() {
      const list = this.$store.state.itemsHouseList || [];
      return this.showAll ? list : list.slice(0, 3);
    },
    totalHouses() {
      const list = this.$store.state.itemsHouseList || [];
      return list.length;
    },
    totalPesoHouse() {
      const list = this.$store.state.itemsHouseList || [];
      const total = list.reduce((acc, it) => acc + (parseFloat(it.peso) || 0), 0);
      return Number.isFinite(total) ? Number(total.toFixed(2)) : 0;
    },
    totalVolumenHouse() {
      const list = this.$store.state.itemsHouseList || [];
      const total = list.reduce((acc, it) => acc + (parseFloat(it.volumen) || 0), 0);
      return Number.isFinite(total) ? Number(total.toFixed(3)) : 0;
    },
    sumaTotal() {
      return 0;
    },
    esAereo() {
      const st = this.$store.state;
      const id = st.master_id_trasnport && st.master_id_trasnport.id ? st.master_id_trasnport.id : st.master_id_trasnport;
      const items = st.itemsShipment || [];
      const it = items.find((v) => v.id == id);
      return it && it.code === "Aéreo";
    },
  },
  methods: {
    showHouse(id) {
      if (this.$route.name == "controlMasterEditar") {
        this.$router.push("/home/folderHouse/control/editar/" + id);
      } else if (this.$route.name == "controlMasterVer") {
        this.$router.push("/home/folderHouse/control/ver/" + id);
      }
    },
    computePesoVolumetrico(item) {
      const m3 = parseFloat(item.volumen || 0);
      const pv = m3 > 0 ? m3 * 166.66 : 0;
      return isNaN(pv) ? 0 : Number(pv.toFixed(2));
    },
    computePesoCargable(item) {
      const kg = parseFloat(item.peso || 0);
      const m3 = parseFloat(item.volumen || 0);
      const charge = Math.max(kg, m3 * 166.66);
      return isNaN(charge) ? 0 : Number(charge.toFixed(2));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.openExpand = 0;
    });
  },
  data: () => ({
    openExpand: 0,
    showAll: false,
    items: [
      { header: "LISTA DE HOUSE" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Birthday gift",
        subtitle:
          '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Recipe to try",
        subtitle:
          '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
      },
    ],
  }),
  watch: {
    "$store.state.itemsHouseList": function (newValue, oldValue) {
      this.openExpand = 0;
      
    },
  },
};
</script>
