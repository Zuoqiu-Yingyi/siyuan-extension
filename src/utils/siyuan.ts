export {
    SiyuanClient,
    MODE,
};

import {
    IResponse,
    IResponse_lsNotebooks,
} from "../types/siyuan";


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


    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<IResponse_lsNotebooks> {
        const response = await this._request("/api/notebook/lsNotebooks");
        return response;
    }

    protected async _request(
        pathname: string,
        data: object = {},
    ): Promise<IResponse> {
        this.url.pathname = pathname;
        const response = await fetch(
            this.url.href,
            {
                body: JSON.stringify(data),
                method: this.method,
                headers: this.headers,
            },
        );
        if (response.ok) {
            const body: IResponse = await response.json();
            if (body.code === 0) {
                return body;
            }
            else {
                throw new Error(body.msg);
            }
        }
        else {
            throw new Error(response.statusText);
        }
    }
}
