import { createApp } from "vue";

import App from "./App.vue";
import "./style.css";

import { createI18n } from "vue-i18n";

import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";

import en from "./locales/en";
import zh_Hans from "./locales/zh-Hans";
import zh_Hant from "./locales/zh-Hant";

const app = createApp(App);

const messages = {
    en,

    zh: zh_Hans,
    "zh-Hans": zh_Hans,
    "zh-CN": zh_Hans,

    "zh-Hant": zh_Hant,
    "zh-TW": zh_Hant,
    "zh-HK": zh_Hant,
};

const locale = navigator.language.startsWith("en") ? "en" : navigator.language;

const i18n = createI18n({
    locale, // set locale
    fallbackLocale: "en", // set fallback locale
    messages,
});

app.use(i18n);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.mount("#app");
