export default {
    check_all: "全選",
    client: "客戶端",
    conect_siyuan_client: "連接@:siyuan@:client",
    conect_success: "連接@:success",
    content: "内容",
    help: {
        server: "@:siyuan_server URL 源",
        token: "可在 @:path.token 中獲取"
    },
    hostname: "IP 地址 {'|'} 域名 {'|'} 主機名",
    language: "語言",
    other: "其他",
    other_settings: "@:other@:settings",
    path: {
        about: "關於",
        settings: "設置",
        token: "@:path.settings > @:path.about > @:token"
    },
    relevance: "相關性",
    result: "結果",
    search: "搜索",
    search_config: {
        method: {
            label: "搜索方案",

            keyword: "關鍵字",
            querySyntax: "查詢語法",
            sql: "SQL 語句",
            regex: "正則表達式",
        },
        groupBy: {
            label: "分組方案",
            details: "@:search_result@:search_config.groupBy.label",

            noGroupBy: "不分組",
            group: "按文檔分組",
        },
        orderBy: {
            label: "排序方案",
            details: "@:search_result@:search_config.orderBy.label",

            type: "塊類型",
            createdASC: "創建時間升序",
            createdDESC: "創建時間降序",
            modifiedASC: "修改時間升序",
            modifiedDESC: "修改時間降序",
            sortByContent: "原文內容順序",
            sortByRankAsc: "相關度升序",
            sortByRankDesc: "相關度降序",
        },
        block_types: {
            label: "塊類型",
            details: "根據 @:search_config.block_types.label 篩選@:search_result",

            leaf: "葉子塊",
            heading: "標題塊",
            paragraph: "段落塊",
            mathBlock: "公式塊",
            table: "表格塊",
            codeBlock: "代碼塊",
            htmlBlock: "HTML塊",

            container: "容器塊",
            document: "文檔塊",
            superBlock: "超級塊",
            blockquote: "引述塊",
            list: "列表塊",
            listItem: "列表項",
        },
    },
    search_result: "@:search@:result",
    search_settings: "@:search@:settings",
    server: "服務",
    server_status: "@:server@:status",
    settings: "設置",
    siyuan: "思源",
    siyuan_server: "@:siyuan@:server",
    status: "狀態",
    success: "成功",
    test: "測試",
    theme: {
        label: "主題",

        dark: "深色@:theme.label",
        light: "淺色@:theme.label",
        system: "跟隨系統",
    },
    time: "時間",
    token: "API Token",
    user: "用戶",
    user_settings: "@:user@:settings",
};
