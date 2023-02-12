import {
    describe,
    test,
    expect,
    expectTypeOf,
} from "vitest";

import {
    SERVER,
    TOKEN,
} from "./custom";

import {
    IResponse_version,

    IResponse_lsNotebooks,

    IResponse_getRecentDocs,

    IPayload_fullTextSearchBlock,
    IResponse_fullTextSearchBlock,

    IPayload_getBlockBreadcrumb,
    IResponse_getBlockBreadcrumb,

    IPayload_searchDocs,
    IResponse_searchDocs,

    IPayload_listDocsByPath,
    IResponse_listDocsByPath,
} from "./../types/siyuan";

import {
    GroupBy,
    Method,
    OrderBy,
} from "./../utils/siyuan"

describe("APIs Test", async () => {
    const siyuan = await import("../utils/siyuan");
    const client = new siyuan.SiyuanClient(new URL(SERVER), TOKEN);

    test("getSiyuanStyleURL", async () => {
        for (const mode of Object.values(siyuan.MODE)) {
            const style_url = await client.getSiyuanStyleURL(mode);
            expect(/base(\.[0-9a-f]+)?\.css$/.test(style_url?.pathname.split("/").pop() ?? "")).toEqual(true);
        }
    });

    test("/api/system/version", async () => {
        const response = await client.version();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_version>();
    });

    test("/api/notebook/lsNotebooks", async () => {
        const response = await client.lsNotebooks();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_lsNotebooks>();
    });

    test("/api/storage/getRecentDocs", async () => {
        const response = await client.getRecentDocs();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_getRecentDocs>();
    });

    test.each((() => {
        const payloads: IPayload_fullTextSearchBlock[] = [];
        for (const groupBy in Object.values(GroupBy).filter(v => !isNaN(Number(v)))) {
            for (const orderBy in Object.values(OrderBy).filter(v => !isNaN(Number(v)))) {
                for (const method in Object.values(Method).filter(v => !isNaN(Number(v)))) {
                    const query = (() => {
                        switch (method as unknown as Method) {
                            case Method.keyword:
                                return "测试"

                            case Method.querySyntax:
                                return '"测试"'

                            case Method.regex:
                                return ".*测试.*"

                            case Method.sql:
                                return "SELECT * FROM blocks WHERE content LIKE '%测试%';"
                        }
                    })();
                    payloads.push({
                        groupBy: groupBy as unknown as number,
                        method: method as unknown as number,
                        orderBy: orderBy as unknown as number,
                        paths: ["20210808180117-czj9bvb"],
                        query,
                        types: {
                            heading: true,
                            paragraph: true,
                            mathBlock: true,
                            table: true,
                            codeBlock: true,
                            htmlBlock: true,
                            embedBlock: true,

                            document: true,
                            superBlock: false,
                            blockquote: false,
                            list: false,
                            listItem: true,
                        },
                    })
                }
            }
        }
        return payloads;
    })())("/api/search/fullTextSearchBlock", async (payload) => {
        const response = await client.fullTextSearchBlock(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_fullTextSearchBlock>();
    });

    test.each((() => {
        const payloads: IPayload_getBlockBreadcrumb[] = [];
        const ids = [
            "20200825162036-4dx365o", // NodeDocument
            "20210604234955-651jbge", // NodeSuperBlock
            "20210604223030-6gapuyv", // NodeBlockquote
            "20210104091228-ttcj9nm", // NodeList
            "20210104091228-0wokn6i", // NodeListItem

            "20210604182832-nm3hapx", // NodeHeading
            "20210604222158-w17nnmy", // NodeParagraph
            "20210104091228-9ok9gv4", // NodeMathBlock
            "20210104091228-eem86ni", // NodeTable
            "20210104091228-mwb2x54", // NodeCodeBlock
            "20220312004517-f6i1k8m", // NodeHTMLBlock

            "20210604222430-tctcbzh", // NodeThematicBreak
            "20210608113713-wm8271x", // NodeAudio
            "20210608113914-zvtw5kj", // NodeVideo
            "20220908200902-6rqv2wt", // NodeIFrame
            // "", // NodeWidget
            "20210604222515-ggpd5hs", // NodeBlockQueryEmbed
        ];

        for (const id of ids) {
            payloads.push({ id, excludeTypes: [] });
        }

        return payloads;
    })())("/api/search/fullTextSearchBlock", async (payload) => {
        const response = await client.getBlockBreadcrumb(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_getBlockBreadcrumb>();
    });

    test("/api/filetree/searchDocs", async () => {
        const payload: IPayload_searchDocs = { k: "测试" };
        const response = await client.searchDocs(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_searchDocs>();
    });

    test("/api/filetree/listDocsByPath", async () => {
        const payload: IPayload_listDocsByPath = {
            notebook: "20210808180117-czj9bvb",
            path: "/",
            sort: 6,
        };
        const response = await client.listDocsByPath(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<IResponse_listDocsByPath>();
    });
});
