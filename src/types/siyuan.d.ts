import {
    Method,
    GroupBy,
    OrderBy,
} from "../utils/siyuan";

/* 响应体 */
export interface IResponse {
    code: number;
    msg: string;
    data: object | string | number | boolean | null;
}

// /api/notebook/lsNotebooks

export interface Notebook {
    id: string;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

export interface Data_lsNotebooks {
    notebooks: Notebook[];
}

export interface IResponse_lsNotebooks {
    code: number;
    msg: string;
    data: Data_lsNotebooks;
}

// /api/system/version

export interface IResponse_version {
    code: number;
    msg: string;
    data: string;
}

// /api/search/fullTextSearchBlock

/* 块类型 */
export interface BlockTypes {
    heading: boolean; // 标题块
    paragraph: boolean; // 段落块
    mathBlock: boolean; // 公式块
    table: boolean; // 表格块
    codeBlock: boolean; // 代码块
    htmlBlock: boolean; // HTML 块

    document: boolean; // 文档块
    superBlock: boolean; // 超级块
    blockquote: boolean; // 引述块
    list: boolean; // 列表块
    listItem: boolean; // 列表项
}

export interface IPayload_fullTextSearchBlock {
    groupBy: GroupBy; // 搜索结果分组方案
    method: Method; // 搜索方案
    orderBy: OrderBy; // 搜索结果排序方案
    paths: string[]; // 指定搜索路径(以 *.sy 结尾不包含子文档)
    query: string; // 搜索关键词
    types: BlockTypes; // 搜索块类型
}

export interface Ial {
    [key: string]: string;
}

export interface Block_fullTextSearchBlock {
    box: string;
    path: string;
    hPath: string;
    id: string;
    rootID: string;
    parentID: string;
    name: string;
    alias: string;
    memo: string;
    tag: string;
    content: string;
    fcontent: string;
    markdown: string;
    folded: boolean;
    type: string;
    subType: string;
    refText: string;
    refs?: any;
    defID: string;
    defPath: string;
    ial: Ial;
    children: Block_fullTextSearchBlock[];
    depth: number;
    count: number;
    sort: number;
    created: string;
    updated: string;
}

export interface Data_fullTextSearchBlock {
    blocks: Block_fullTextSearchBlock[];
    matchedBlockCount: number;
    matchedRootCount: number;
}

export interface IResponse_fullTextSearchBlock {
    code: number;
    msg: string;
    data: Data_fullTextSearchBlock;
}
