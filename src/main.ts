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

import { mapLocal } from "./utils/language";

/* 语言包 */
const messages = {
    "en": en,
    "zh-Hans": zh_Hans,
    "zh-Hant": zh_Hant,
};

const locale = mapLocal(navigator.language, messages);
const fallbackLocale = "en";

const i18n = createI18n({
    locale, // set locale
    fallbackLocale, // set fallback locale
    messages,
});

const app = createApp(App);
app.provide("i18n", i18n); // 提供全局依赖

app.use(i18n); // 国际化
app.use(ArcoVue); // Arco 组件库
app.use(ArcoVueIcon); // Arco 组件库图标
app.mount("#app");
