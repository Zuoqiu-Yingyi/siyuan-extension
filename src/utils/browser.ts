export {
    browser,
};

import { Browser } from "webextension-polyfill";

const browser = (globalThis as Record<string, any>).browser as Browser;
