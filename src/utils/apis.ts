export {
    MODE,
    getSiyuanStyleURL,
};

enum MODE {
    app = 'app',
    desktop = 'desktop',
    export = 'export',
    mobile = 'mobile',
};

/**
 * @params server: 思源服务 URL 对象
 * @params token: 思源 Token
 * @params mode: 思源模式
 * @return style_url: 思源样式 URL 对象
 */
async function getSiyuanStyleURL(server: URL, token: string, mode: MODE = MODE.desktop): Promise<URL> {
    const style_url = new URL(server);
    switch (mode) {
        case MODE.export: // 导出样式文件
            style_url.pathname = `/stage/build/export/base.css`;
            return style_url;
        default:
            style_url.pathname = `/stage/build/${mode}/index.html`;
            style_url.searchParams.set('r', new Date().getTime().toString(36));
            break;
    }

    /* 获得 index.html 内容 */
    const response = await fetch(
        style_url.href,
        {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
            },
        },
    );

    if (!response.ok) {
        // console.error(response);
        throw new Error(response.statusText);
    }
    
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
