import { IPayload_fullTextSearchBlock } from "./siyuan"

export interface IConfig {
    server: {
        protocol: string,
        hostname: string,
        port: number,
        token: string,
        url: URL,
    },
    search: Omit<IPayload_fullTextSearchBlock, 'query'>, // 省略 query 属性
    render: {
        breadcrumb: {
            wrap: boolean,
            item: {
                wrap: boolean,
            },
        },
        tree: {
            fold: boolean,
        },
    },
    other: {
        language: ILanguage,
        languages: ILanguage[],
    },
}

interface ILanguage {
    tag: string, // 语言标识
    label: string, // 语言名称
}
