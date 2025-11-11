<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="12">
          <list-request-payment filtrarFlag="false" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import ListRequestPayment from "../../components/folderRequests/listRequestPayment.vue";
import debstoPay from "../../components/folderRequests/debstoPay.vue";
export default {
  name: "controlRequest",
  components: {
    ListRequestPayment,
    debstoPay,
  },
};
</script>
