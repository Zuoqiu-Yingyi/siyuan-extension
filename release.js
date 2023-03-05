import fs from "fs";
import archiver from "archiver";

const OUR_DIR = "dist"; // 输出目录
const RELEASE_DIR = "release"; // 发布目录

/**
 * 读取 manifest 文件
 */
function getManifest(path = "./src/manifest.json") {
    const manifestJSON = fs.readFileSync("./src/manifest.json", { encoding: "utf-8" });
    const manifest = JSON.parse(manifestJSON);
    return manifest;
}

/**
 * 读取版本号
 * @return {string} 版本号
 */
function getVersion() {
    const { version } = getManifest();
    return version;
}

/**
 * 打包目录
 * @params {string} source 源目录
 * @params {target} target 目标文件
 */
async function pack(source, target) {
    const output = fs.createWriteStream(target)
    const archive = archiver("zip", {
        zlib: { level: 9 },
    })
    archive.pipe(output)
    archive.directory(source, false)
    await archive.finalize()
}

async function release() {
    const version = getVersion();
    fs.mkdirSync(`./${RELEASE_DIR}/`, { recursive: true }); // 创建发行目录
    await pack(`./${OUR_DIR}/chromium`, `./${RELEASE_DIR}/siyuan-extension-chromium-v${version}.zip`); // 打包 chromium 扩展
    await pack(`./${OUR_DIR}/firefox`, `./${RELEASE_DIR}/siyuan-extension-firefox-v${version}.zip`); // 打包 firefox 扩展
}

release();
