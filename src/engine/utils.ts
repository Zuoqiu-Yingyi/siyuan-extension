// REF https://github.com/wong2/chat-gpt-google-extension/blob/main/src/content-script/utils.ts

export {
    getPossibleElementByQuerySelector,
};

function getPossibleElementByQuerySelector<T extends Element>(
    queryArray: string[],
): T | undefined {
    for (const query of queryArray) {
        const element = document.querySelector(query)
        if (element) {
            return element as T
        }
    }
}
