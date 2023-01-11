export default {
    check_all: "Check All",
    client: "Client",
    conect_siyuan_client: "Connect @:siyuan @:client",
    conect_success: "Connect @:success",
    content: "Content",
    help: {
        server: "@:siyuan_server URL Origin",
        token: "Available in @:path.token"
    },
    hostname: "IP Address {'|'} Domain Name {'|'} Host Name",
    language: "Language",
    other: "Other",
    other_settings: "@:other @:settings",
    path: {
        about: "About",
        settings: "Settings",
        token: "@:path.settings > @:path.about > @:token"
    },
    relevance: "Relevance",
    result: "Results",
    search: "Search",
    search_config: {
        method: {
            label: "@:search Scheme",

            keyword: "Keyword",
            querySyntax: "Query Syntax",
            sql: "SQL Statement",
            regex: "Regular Expression",
        },
        groupBy: {
            label: "Grouping Scheme",
            details: "@:search_result @:search_config.groupBy.label",

            noGroupBy: "No Grouping",
            group: "Group by Document",
        },
        orderBy: {
            label: "Sorting Scheme",
            details: "@:search_result @:search_config.orderBy.label",

            type: "Block Type",
            createdASC: "Ascending by Creation Time",
            createdDESC: "Descending by Creation Time",
            modifiedASC: "Ascending by Modification Time",
            modifiedDESC: "Descending by Modification Time",
            sortByContent: "Original Content Order",
            sortByRankAsc: "Ascending by Relevance",
            sortByRankDesc: "Descending by Relevance",
        },
        block_types: {
            label: "Block Type",
            details: "Filter @:search_result Based on @:search_config.block_types.label",

            leaf: "Leaf Block",
            heading: "Heading Block",
            paragraph: "Paragraph Block",
            mathBlock: "Formula Block",
            table: "Table Block",
            codeBlock: "Code Block",
            htmlBlock: "HTML Block",

            container: "Container Block",
            document: "Document Block",
            superBlock: "Super Block",
            blockquote: "Quote Block",
            list: "List Block",
            listItem: "List Item",
        },
    },
    search_description: {
        doc_count: "Number of Documents",
        block_count: "Number of Blocks",
    },
    search_result: "@:search @:result",
    search_settings: "@:search @:settings",
    server: "Server",
    server_status: "@:server @:status",
    settings: "Settings",
    siyuan: "SiYuan",
    siyuan_server: "@:siyuan @:server",
    status: "Status",
    success: "Success",
    test: "Test",
    theme: {
        label: "Theme",

        dark: "Dark @:theme.label",
        light: "Light @:theme.label",
        system: "Follow System",
    },
    time: "Time",
    token: "API Token",
    user: "User",
    user_settings: "@:user @:settings",
};
