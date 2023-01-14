export type {
    TreeNode,
};
export {
    Tree,
};

import {
    h,
    reactive,
    watch,
    VNode,
    ShallowReactive,
    UnwrapNestedRefs,
} from "vue";
import { TreeNodeData } from "@arco-design/web-vue";

import BlockIcon from "./../components/BlockIcon.vue";

import {
    INotebooks,
    Block_fullTextSearchBlock,
    Data_fullTextSearchBlock,
} from "./../types/siyuan";

import {
    IBreadcrumbItem,
    Separator,
} from "./breadcrumb";
import {
    BlockType,
    BlockSubType,
} from "./siyuan";

interface TreeNode extends TreeNodeData {
    key: string | number;
    title: string;
    isLeaf: boolean;
    icon: () => VNode[];
    children: TreeNode[];
}

class Tree {
    constructor(
        results: ShallowReactive<Data_fullTextSearchBlock>,
        protected _notebooks: ShallowReactive<INotebooks>, // 笔记本
        public data: UnwrapNestedRefs<TreeNode[]> = reactive([]), // 树形数据
        public map: Map<string, TreeNode> = new Map, // ID => 树节点
    ) {
        watch(
            () => results.blocks,
            blocks => this._updateDoc(blocks),
            { immediate: true },
        );
    }

    /* 跟踪查询结果构造树 */
    protected _updateDoc(blocks: Block_fullTextSearchBlock[]) {
        /* 删除原树 */
        this.data.length = 0;
        this.map.clear();

        if (blocks.length === 0) return;

        const doc_set = new Set<string>(); // 文档 ID 集合, 用于去重
        const docs = blocks.filter(block => {
            if (doc_set.has(block.rootID)) {
                return false;
            }
            else {
                doc_set.add(block.rootID);
                return true;
            }
        });

        /* 使用笔记本构造树的根节点列表 */
        this._notebooks.list.forEach(notebook => {
            const node: TreeNode = {
                key: notebook.id,
                title: notebook.name,
                isLeaf: false,
                icon: () => [h("span", { innerHTML: notebook.icon })],
                children: [],
            };
            this.data.push(node);
            this.map.set(notebook.id, node);
        });

        /* 构造文档级别的树 */
        docs.forEach(doc => {
            const breadcrumb = this.parseDocPath(doc);
            const root = this.map.get(doc.box);
            if (!root) throw new Error(`Notebook ${doc.box} not found`);

            breadcrumb.reduce((parent: TreeNode, child: IBreadcrumbItem) => {
                const current_node = this.map.get(child.path); // 当前节点是否已经添加到树中
                if (current_node) {
                    return current_node;
                }
                else {
                    const node: TreeNode = {
                        key: child.path,
                        title: child.label,
                        isLeaf: false,
                        icon: () => [h(BlockIcon, { type: child.type, subtype: child.subType })],
                        children: [],
                    };
                    this.map.set(child.path, node);
                    parent.children.push(node);
                    return node;
                }
            }, root as unknown as TreeNode);
        });
    }

    /* 解析文档节点路径 */
    public parseDocPath(block: Block_fullTextSearchBlock): IBreadcrumbItem[] {
        const breadcrumb: IBreadcrumbItem[] = [];

        /* 添加笔记本 */
        const notebook = this._notebooks.map.get(block.box);
        if (!notebook) throw new Error(`Notebook ${block.box} not found`);

        breadcrumb.push({
            path: notebook.id,
            label: notebook.name,
            separator: Separator.notebook,
            icon: false,
            type: BlockType.NodeNotebook,
            subType: BlockSubType.none,
        });

        /* 添加文档 */
        const paths = block.path.substring(0, block.path.lastIndexOf(".")).split("/"); // 文档 ID 路径
        const hPaths = block.hPath.split("/"); // 可读路径

        if (paths.length !== hPaths.length) throw new Error(`Path length mismatch: path="${block.path}", hPath="${hPaths}"`);

        for (let i = 1; i < paths.length; ++i) {
            breadcrumb.push({
                path: paths[i],
                label: hPaths[i],
                separator: Separator.document,
                icon: true,
                type: BlockType.NodeDocument,
                subType: BlockSubType.none,
            });
        }

        return breadcrumb;
    }
}
