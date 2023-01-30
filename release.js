import fs from "fs";
import archiver from "archiver";

const OUR_DIR = "dist"; // 输出目录
const RELEASE_DIR = "release"; // 发布目录

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
    fs.mkdirSync(`./${RELEASE_DIR}/`);
    await pack(`./${OUR_DIR}/chromium`, `./${RELEASE_DIR}/chromium.zip`);
    await pack(`./${OUR_DIR}/firefox`, `./${RELEASE_DIR}/firefox.zip`);
}

release();
