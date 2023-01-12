export {
    Icon,
};

class Icon {

    /**
     * UTF-32 解码
     * REF [javascript 的 字符串编码 - 知乎](https://zhuanlan.zhihu.com/p/386511092)
     * @params: hex: 16 进制 UTF-32 字符串
     * @return: 解码后字符串
     */
    public static utf32Decode(hex: string): string {
        return String.fromCodePoint(parseInt(hex, 16));
    }

    /**
     * 自定义图标转换为 img 标签
     * @params: path: 自定义图标路径
     * @params: url: 思源服务 URL
     * @return: img 标签 HTML
     */
    public static icon2img(path: string, url: URL): string {
        return `<img src="${url.origin}/emojis/${path}" />`;
    }

    public static icon2emojis(icon: string, url: URL): string {
        return /^[0-9a-f]+$/.test(icon) ? Icon.utf32Decode(icon) : Icon.icon2img(icon, url);
    }

}
