// REF https://github.com/wong2/chat-gpt-google-extension/blob/main/src/content-script/index.tsx

export {
    Engine,
};

import { searchEngineConfig } from "./config";
import { getPossibleElementByQuerySelector } from "./utils";

class Engine {
    public stop: (() => void) | undefined;

    constructor(
        protected _onchange: (query: string) => void,
        public readonly siteRegex = new RegExp(Object.keys(searchEngineConfig).join('|')),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        public readonly siteName = location.hostname.match(siteRegex)![0],
        public readonly siteConfig = searchEngineConfig[siteName],
        public readonly searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery),
    ) {
        this.query(this._onchange);
        this.stop = siteConfig.watchRouteChange?.(() => this.query(this._onchange));
    }

    public query(callback: (query: string) => void): void {
        if (this.searchInput?.value) {
            callback(this.searchInput.value);
        }
    }
}
