export type {
    TreeNode,
};
export {
    Tree,
};

import { useI18n, VueI18nTranslation } from "vue-i18n";
import {
    h,
    ref,
    reactive,
    watch,
    ShallowReactive,
    UnwrapNestedRefs,
} from "vue";
import { TreeNodeData } from "@arco-design/web-vue";
import {
    IconCaretDown,
    IconCaretRight,
    IconLoading,
    IconToRight,
} from "@arco-design/web-vue/es/icon";

import BlockIcon from "./../components/BlockIcon.vue";

import {
    INotebooks,
    Block_fullTextSearchBlock,
    Data_fullTextSearchBlock,
    Data_getBlockBreadcrumb,
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
    key: string;
    title: string;
    isLeaf: boolean;
}

class Tree {
    protected $t: VueI18nTranslation;

    constructor(
        results: ShallowReactive<Data_fullTextSearchBlock>,
        protected _notebooks: ShallowReactive<INotebooks>, // 笔记本
        public data: UnwrapNestedRefs<TreeNode[]> = reactive([]), // 树形数据
        public map: Map<string, TreeNode> = new Map(), // ID => 树节点
        public signal = ref(0), // 更新信号, 每次更新时取反, 用于触发组件更新
    ) {
        const { t: $t } = useI18n();
        this.$t = $t;

        watch(
            () => results.blocks,
            blocks => this._updateDoc(blocks),
            { immediate: true },
        );
    }

    /* 广播更新信号 */
    public broadcast(): void {
        this.signal.value++;
    }

    /* 根据查询结果构造文档树 */
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
        const roots: TreeNode[] = [];
        this._notebooks.list.forEach(notebook => {
            const node: TreeNode = {
                key: notebook.id,
                title: notebook.name,
                isLeaf: false,
                icon: () => [h("span", { innerHTML: notebook.icon })],
                children: [],
            };
            roots.push(node);
            this.map.set(notebook.id, node);
        });
        this.data.push(...roots);

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
                        icon: child.icon
                            ? () => [h(BlockIcon, { type: child.type, subtype: child.subType })]
                            : undefined, // 表示无图标
                        children: undefined // 可激活动态加载
                    };
                    if (child.path.endsWith(".sy")) { // 文档节点
                        // node.switcherIcon = () => [h(IconRightCircle)]; // 展开图标
                        node.switcherIcon = () => [h(IconCaretRight)]; // 展开图标
                        node.loadingIcon = () => [h(IconLoading)]; // 动态加载图标
                    }
                    this.map.set(child.path, node);
                    parent.children?.push(node) ?? (parent.children = [node]);
                    return node;
                }
            }, root as unknown as TreeNode);
        });
        this.broadcast();
    }

    /**
     * 更新块级树
     * @params node: 文档节点
     * @params breadcrumbs: 文档内各块的面包屑
     * @return : 更新的节点 key 列表
     */
    public updateBlocks(
        node: TreeNode,
        breadcrumbs: Data_getBlockBreadcrumb[][],
    ): string[] {
        const keys: string[] = []; // 更新的节点 key 列表
        breadcrumbs.forEach(breadcrumb => {
            breadcrumb.shift(); // 移除文档路径
            if (breadcrumb.length === 0) { // 文档节点
                // node.icon = () => [h(BlockIcon, { type: BlockType.NodeDocument, subtype: BlockSubType.none })];
                return; // 无需更新
            }
            const leaf = breadcrumb.reduce((parent: TreeNode, child: Data_getBlockBreadcrumb) => {
                const current_node = this.map.get(child.id); // 当前节点是否已经添加到树中
                if (current_node) {
                    return current_node;
                }
                else {
                    const node: TreeNode = {
                        key: child.id,
                        title: (() => {
                            switch (child.type) {
                                case BlockType.NodeMathBlock:
                                case BlockType.NodeTable:
                                case BlockType.NodeCodeBlock:
                                case BlockType.NodeHTMLBlock:
                                case BlockType.NodeThematicBreak:
                                case BlockType.NodeAudio:
                                case BlockType.NodeVideo:
                                case BlockType.NodeIFrame:
                                case BlockType.NodeWidget:
                                case BlockType.NodeBlockQueryEmbed:
                                    return this.$t(`types.${child.type}`);
                                default:
                                    return child.name;
                            }
                        })(),
                        isLeaf: false,
                        icon: () => [h(BlockIcon, { type: child.type, subtype: child.subType })],
                        children: [],
                    };
                    keys.push(child.id);
                    this.map.set(child.id, node);
                    parent.children?.push(node) ?? (parent.children = [node]);
                    return node;
                }
            }, node);

            leaf.isLeaf = true;
            leaf.switcherIcon = () => [h(IconToRight)];
        });
        if (node.children?.length) { // 文档下级存在子节点(存在非文档节点)
            node.switcherIcon = () => [h(IconCaretDown)];
        }
        else { // 文档下级无子节点(仅匹配到了文档)
            node.switcherIcon = () => [h(IconToRight)];
        }
        return keys;
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
        // const paths = block.path.substring(0, block.path.lastIndexOf(".")).split("/"); // 文档 ID 路径
        const paths = block.path.split("/"); // "ID" 为文件夹(存在子文档), "ID.sy" 为文档(存在子块)
        const hPaths = block.hPath.split("/"); // 可读路径

        if (paths.length !== hPaths.length) throw new Error(`Path length mismatch: path="${block.path}", hPath="${block.hPath}"`);

        /* 作为文件夹(存在子文档) */
        for (let i = 1, len = paths.length - 1; i < len; ++i) {
            breadcrumb.push({
                path: paths[i],
                label: hPaths[i],
                separator: Separator.document,
                icon: true,
                type: BlockType.NodeFolder,
                subType: BlockSubType.none,
            });
        }

        /* 作为文档块(存在子块) */
        breadcrumb.push({
            path: paths.at(-1) as string,
            label: hPaths.at(-1) as string,
            separator: Separator.document,
            icon: true,
            type: BlockType.NodeDocument,
            subType: BlockSubType.none,
        });

        return breadcrumb;
    }
}
