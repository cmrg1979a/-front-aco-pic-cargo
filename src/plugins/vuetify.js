import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: '#03A9F4',
        secondary: '#0288D1',
        accent: '#B3E5FC',
        info: '#29B6F6',
        success: '#26A69A',
        warning: '#FFD54F',
        error: '#E57373',
      },
    },
  },
});
