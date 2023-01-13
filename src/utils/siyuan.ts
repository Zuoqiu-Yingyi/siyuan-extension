export {
    SiyuanClient,
    MODE,
};

import { Ref } from "vue";
import { Status } from "./status";
import {
    IResponse,
    IResponse_version,
    IResponse_lsNotebooks,
    IPayload_fullTextSearchBlock,
    IResponse_fullTextSearchBlock,
    IPayload_getBlockBreadcrumb,
    IResponse_getBlockBreadcrumb,
} from "./../types/siyuan";

/* 叶子块 */
export enum Leaf {
    /* 可搜索时过滤 */
    h, // 标题块
    p, // 段落块
    m, // 公式块
    t, // 表格块
    c, // 代码块
    html, // HTML 块

    /* 不可搜索时过滤 */
    tb, // 分隔线
    audio, // 音频块
    video, // 视频块
    iframe, // iframe
    widget, // 挂件块
    query_embed, // 嵌入块
}

/* 容器块 */
export enum Container {
    d, // 文档块
    s, // 超级块
    b, // 引述块
    l, // 列表块
    i, // 列表项
}

/* 块级节点类型 */
export enum BlockType {
    NodeDocument = "NodeDocument",
    NodeSuperBlock = "NodeSuperBlock",
    NodeBlockquote = "NodeBlockquote",
    NodeList = "NodeList",
    NodeListItem = "NodeListItem",

    NodeHeading = "NodeHeading",
    NodeParagraph = "NodeParagraph",
    NodeMathBlock = "NodeMathBlock",
    NodeTable = "NodeTable",
    NodeCodeBlock = "NodeCodeBlock",
    NodeHTMLBlock = "NodeHTMLBlock",

    NodeThematicBreak = "NodeThematicBreak",
    NodeAudio = "NodeAudio",
    NodeVideo = "NodeVideo",
    NodeIFrame = "NodeIFrame",
    NodeWidget = "NodeWidget",
    NodeBlockQueryEmbed = "NodeBlockQueryEmbed",
}

/**
 * 搜索方案
 * REF: https://github.com/siyuan-note/siyuan/blob/145243e0583b7259fed143833a648e61f8863528/kernel/api/search.go#L221
 */
export enum Method {
    keyword, // 关键字
    querySyntax, // 查询语法
    sql, // SQL
    regex, // 正则表达式
}

/**
 * 搜索结果分组方案
 * REF: https://github.com/siyuan-note/siyuan/blob/145243e0583b7259fed143833a648e61f8863528/kernel/api/search.go#L231
 */
export enum GroupBy {
    noGroupBy, // 不分组
    group, // 按文档分组
}

/**
 * 搜索结果排序方案
 * REF: https://github.com/siyuan-note/siyuan/blob/145243e0583b7259fed143833a648e61f8863528/kernel/api/search.go#L226
 */
export enum OrderBy {
    type, // 按块类型（默认）
    createdASC, // 创建时间升序
    createdDESC, // 创建时间降序
    modifiedASC, // 修改时间升序
    modifiedDESC, // 修改时间降序
    sortByContent, // 按原文内容顺序（仅限按文档分组）
    sortByRankAsc, // 按相关度升序
    sortByRankDesc, // 按相关度降序
}

enum MODE {
    app = "app",
    desktop = "desktop",
    export = "export",
    mobile = "mobile",
}

class SiyuanClient {

    public readonly method: string = "POST"; // 请求方法
    public readonly headers: {
        Authorization: string;
        [propName: string]: string;
    }; // 请求头

    constructor(
        public url: URL,
        public token: string,
        protected _status?: Ref<Status>,
        protected _message?: Ref<string>,
    ) {
        this.headers = {
            Authorization: `Token ${this.token}`,
        };
    }

    /* 更新配置 */
    public update(
        url: URL,
        token: string,
    ) {
        this.url = url;
        this.token = token;
        this.headers.Authorization = `Token ${this.token}`;
    }

    /* 更新状态 */
    public set status(status: Status) {
        if (this._status?.value) {
            this._status.value = status;
        }
    }
    public set message(message: string) {
        if (this._message?.value !== undefined) {
            this._message.value = message;
        }
    }

    /* 获得思源样式文件 URL */
    public async getSiyuanStyleURL(mode: MODE = MODE.desktop): Promise<URL> {
        const style_url = new URL(this.url);
        switch (mode) {
            case MODE.export: // 导出样式文件
                style_url.pathname = `/stage/build/export/base.css`;
                return style_url;
            default:
                style_url.pathname = `/stage/build/${mode}/index.html`;
                style_url.searchParams.set("r", new Date().getTime().toString(36));
                break;
        }

        /* 获得 index.html 内容 */
        const response = await fetch(
            style_url.href,
            {
                method: "GET",
                headers: this.headers,
            },
        );

        if (response.ok) {
            const html = await response.text();

            /* 在 index.html 中匹配 base.*.css 文件名 */
            const result = /<link href="(?<style>base\.[0-9a-f]{20}\.css)" rel="stylesheet">/.exec(html);
            if (!result?.groups?.style) {
                // console.error(result);
                throw new Error(`Can't match to a style file.`);
            }

            style_url.pathname = `/stage/build/${mode}/${result?.groups?.style}`;
            return style_url;
        }
        else {
            throw new Error(response.statusText);
        }
    }

    /* 获得内核版本 */
    public async version(): Promise<IResponse_version> {
        const response = await this._request("/api/system/version") as IResponse_version;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<IResponse_lsNotebooks> {
        const response = await this._request("/api/notebook/lsNotebooks") as IResponse_lsNotebooks;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: IPayload_fullTextSearchBlock): Promise<IResponse_fullTextSearchBlock> {
        const response = await this._request("/api/search/fullTextSearchBlock", payload) as IResponse_fullTextSearchBlock;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: IPayload_getBlockBreadcrumb): Promise<IResponse_getBlockBreadcrumb> {
        const response = await this._request("/api/block/getBlockBreadcrumb", payload) as IResponse_getBlockBreadcrumb;
        return response;
    }

    protected async _request(
        pathname: string,
        payload: object = {},
    ): Promise<IResponse> {
        this.status = Status.processing;
        this.message = "";

        this.url.pathname = pathname;
        let response;

        try {
            response = await fetch(
                this.url.href,
                {
                    body: JSON.stringify(payload),
                    method: this.method,
                    headers: this.headers,
                },
            );
        } catch (error) {
            this.status = Status.danger;
            this.message = String(error);
            throw error;
        }

        if (response.ok) {
            const body: IResponse = await response.json();

            if (body.code === 0) {
                this.status = Status.success;
                this.message = body.msg;
                return body;
            }
            else {
                const error = new Error(body.msg);
                this.status = Status.warning;
                this.message = String(error);
                throw error;
            }
        }
        else {
            const error = new Error(response.statusText);
            this.status = Status.danger;
            this.message = String(error);
            throw error;
        }
    }
}
