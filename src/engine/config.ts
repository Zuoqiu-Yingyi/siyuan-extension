// REF https://github.com/wong2/chat-gpt-google-extension/blob/main/src/content-script/search-engine-configs.ts

export type {
    ISearchEngine,
};

export {
    searchEngineConfig,
};

interface ISearchEngine {
    inputQuery: string[];
    sidebarContainerQuery: string[];
    appendContainerQuery: string[];
    watchRouteChange?: (callback: () => void) => () => void;
}

const searchEngineConfig: Record<string, ISearchEngine> = {
    google: {
        inputQuery: ["input[name='q']"],
        sidebarContainerQuery: ['#rhs'],
        appendContainerQuery: ['#rcnt'],
    },
    bing: {
        inputQuery: ["[name='q']"],
        sidebarContainerQuery: ['#b_context'],
        appendContainerQuery: [],
    },
    yahoo: {
        inputQuery: ["input[name='p']"],
        sidebarContainerQuery: ['#right', '.Contents__inner.Contents__inner--sub'],
        appendContainerQuery: ['#cols', '#contents__wrap'],
    },
    duckduckgo: {
        inputQuery: ["input[name='q']"],
        sidebarContainerQuery: ['.results--sidebar.js-results-sidebar'],
        appendContainerQuery: ['#links_wrapper'],
    },
    baidu: {
        inputQuery: ["input[name='wd']"],
        sidebarContainerQuery: ['#content_right'],
        appendContainerQuery: ['#container'],
        watchRouteChange(callback): () => void {
            const targetNode = globalThis.document.getElementById('wrapper_wrapper')!;
            if (targetNode) {
                const observer = new MutationObserver(records => {
                    for (const record of records) {
                        if (record.type === 'childList') {
                            for (const index in record.addedNodes) {
                                const node = record.addedNodes[index];
                                if ('id' in node && node.id === 'container') {
                                    callback();
                                    return;
                                }
                            }
                        }
                    }
                })
                observer.observe(targetNode, { childList: true });
                return observer.disconnect;
            }
            return () => null;
        },
    },
    kagi: {
        inputQuery: ["input[name='q']"],
        sidebarContainerQuery: ['.right-content-box._0_right_sidebar'],
        appendContainerQuery: ['#_0_app_content'],
    },
    yandex: {
        inputQuery: ["input[name='text']"],
        sidebarContainerQuery: ['#search-result-aside'],
        appendContainerQuery: [],
    },
    naver: {
        inputQuery: ["input[name='query']"],
        sidebarContainerQuery: ['#sub_pack'],
        appendContainerQuery: ['#content'],
    },
    brave: {
        inputQuery: ["input[name='q']"],
        sidebarContainerQuery: ['#side-right'],
        appendContainerQuery: [],
    },
    searx: {
        inputQuery: ["input[name='q']"],
        sidebarContainerQuery: ['#sidebar_results'],
        appendContainerQuery: [],
    },
};
