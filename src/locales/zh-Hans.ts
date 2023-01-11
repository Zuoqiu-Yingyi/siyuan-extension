export default {
    check_all: "全选",
    client: "客户端",
    conect_siyuan_client: "连接@:siyuan@:client",
    conect_success: "连接@:success",
    content: "内容",
    help: {
        server: "@:siyuan_server URL 源",
        token: "可在 @:path.token 中获取"
    },
    hostname: "IP 地址 {'|'} 域名 {'|'} 主机名",
    language: "语言",
    other: "其他",
    other_settings: "@:other@:settings",
    path: {
        about: "关于",
        settings: "设置",
        token: "@:path.settings > @:path.about > @:token"
    },
    relevance: "相关性",
    result: "结果",
    search: "搜索",
    search_config: {
        method: {
            label: "搜索方案",

            keyword: "关键字",
            querySyntax: "查询语法",
            sql: "SQL 语句",
            regex: "正则表达式",
        },
        groupBy: {
            label: "分组方案",
            details: "@:search_result@:search_config.groupBy.label",

            noGroupBy: "不分组",
            group: "按文档分组",
        },
        orderBy: {
            label: "排序方案",
            details: "@:search_result@:search_config.orderBy.label",

            type: "块类型",
            createdASC: "创建时间升序",
            createdDESC: "创建时间降序",
            modifiedASC: "修改时间升序",
            modifiedDESC: "修改时间降序",
            sortByContent: "原文内容顺序",
            sortByRankAsc: "相关度升序",
            sortByRankDesc: "相关度降序",
        },
        block_types: {
            label: "块类型",
            details: "根据 @:search_config.block_types.label 筛选@:search_result",

            leaf: "叶子块",
            heading: "标题块",
            paragraph: "段落块",
            mathBlock: "公式块",
            table: "表格块",
            codeBlock: "代码块",
            htmlBlock: "HTML块",

            container: "容器块",
            document: "文档块",
            superBlock: "超级块",
            blockquote: "引述块",
            list: "列表块",
            listItem: "列表项",
        },
    },
    search_description: {
        doc_count: "文档数",
        block_count: "块数",
    },
    search_result: "@:search@:result",
    search_settings: "@:search@:settings",
    server: "服务",
    server_status: "@:server@:status",
    settings: "设置",
    siyuan: "思源",
    siyuan_server: "@:siyuan@:server",
    status: "状态",
    success: "成功",
    test: "测试",
    theme: {
        label: "主题",

        dark: "深色@:theme.label",
        light: "浅色@:theme.label",
        system: "跟随系统",
    },
    time: "时间",
    token: "API Token",
    user: "用户",
    user_settings: "@:user@:settings",
};
