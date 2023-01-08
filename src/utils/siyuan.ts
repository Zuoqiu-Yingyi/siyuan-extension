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

    protected async _request(
        pathname: string,
        data: object = {},
    ): Promise<IResponse> {
        this.status = Status.processing;
        this.message = "";

        this.url.pathname = pathname;
        let response;

        try {
            response = await fetch(
                this.url.href,
                {
                    body: JSON.stringify(data),
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
