export {
    Mode,
    DocTree,
};

import { ShallowReactive, reactive, ref, watch, h, unref } from "vue";
import { useI18n, VueI18nTranslation } from "vue-i18n";

import { Data_searchDocs, ID, INotebooks, Notebook } from "./../types/siyuan";
import { TreeNode } from "./tree";

enum Mode {
    default, // 默认模式 (从笔记本一级开始, 逐级展开&加载文档树并选择)
    search, // 搜索模式 (搜索文档名并构建文档树)
}

/* 文档树 */
class DocTree {
    protected $t: VueI18nTranslation;

    constructor(
        protected _notebooks: ShallowReactive<INotebooks>, // 笔记本
        public data = reactive<TreeNode[]>([]), // 树形数据(key: 完整 path)
        public map: Map<string, TreeNode> = new Map(), // ID => 树节点
        public mode = ref<Mode>(Mode.default), // 模式
    ) {
        const { t: $t } = useI18n();
        this.$t = $t;

        /* 跟踪笔记本数据更新 */
        watch(
            () => this._notebooks.list,
            notebooks => this.initRoots(notebooks),
            { immediate: true },
        )
    }

    /* 初始化文档树根节点 */
    public initRoots(notebooks: Notebook[] = this._notebooks.list): void {
        this.data.length = 0;
        this.map.clear();

        const roots: TreeNode[] = [];
        notebooks.forEach(notebook => {
            const node: TreeNode = {
                key: notebook.id,
                title: notebook.name,
                isLeaf: false,
                icon: () => [h("span", { innerHTML: notebook.icon })],
            };
            this.map.set(notebook.id, node);
            roots.push(node);
        });

        this.data.push(...roots);
    }

    /* 解析搜索的文档 */
    public parseSearchDocs(docs: Data_searchDocs[]): void {
        this.initRoots();
        this.data.forEach(root => {
            root.isLeaf = true;
            root.disabled = true;
        });
        docs.forEach(doc => {
            delete this.map.get(doc.box)?.disabled;

            const paths: string[] = []; // ID 路径
            const hPaths: string[] = []; // 可读路径
            switch (true) {
                case doc.path.endsWith("/"): // 笔记本
                    paths.push(doc.box);
                    hPaths.push(doc.hPath.split("/")[0]);
                    break;
                case doc.path.endsWith(".sy"): // 文档
                    paths.push(...`${doc.box}${doc.path.split(".")[0]}`.split("/"));
                    hPaths.push(...doc.hPath.split("/"));
                    break;
                default:
                    break;
            }

            if (paths.length !== hPaths.length) // ID 路径与可读路径深度不一致
                throw new Error(`Path length mismatch: path="${doc.path}", hPath="${doc.hPath}"`);

            if (paths.length === 0) // 无效的路径
                return;

            let depth = paths.length; // 节点深度
            while (depth-- && !this.map.has(paths[depth])); // 找到第一个已存在的节点

            if (depth === -1) // 未找到已存在的根节点
                throw new Error(`Notebook not found: path="${paths[0]}", hPath="${hPaths[0]}"`);

            for (let node = this.map.get(paths[depth]); depth + 1 < paths.length; ++depth) {
                if (node === undefined) // 未找到已存在的节点
                    throw new Error(`Document not found: path="${paths.slice(0, depth + 1).join("/")}", hPath="${hPaths.slice(0, depth + 1).join("/")}"`);

                /* 新节点 */
                const child: TreeNode = {
                    key: paths.slice(0, depth + 2).join("/"),
                    title: hPaths.slice(0, depth + 2).join("/"),
                    isLeaf: true,
                };
                this.map.set(paths[depth + 1], child);

                node.isLeaf = false; // 非叶子节点
                if (Array.isArray(node.children))// 存在子节点列表
                    node.children.push(child);
                else // 不存在子节点列表
                    node.children = [child];
                node = child; // 处理下一层节点
            }
        })
    }
}
