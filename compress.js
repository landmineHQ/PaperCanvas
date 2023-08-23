console.log("Starting compressing...");
const compressing = require('compressing');
const path = require('path');
if (compressing === undefined || !compressing) {
    console.log("Required Compressing, please install it first before running")
}
// configure
const config = {
    compressedFileName: "dist.zip",
    compressingDirectory: "dist"
}

// 压缩dist文件夹里的所有文件到dist.zip
compressing.zip.compressDir(config.compressingDirectory, config.compressedFileName, { ignoreBase: true })
    .then(() => {
        console.log('Compressing task finished successfully' + '\ntarget directory ' + path.join(__dirname, config.compressedFileName));
    })
    .catch(err => {
        console.error('Compressing task failed, please check your configuration', err);
    });
