const compressing = require('compressing')

compressing.zip.compressDir('dist', 'dist.zip')
    .then(() => {
        console.log('压缩完成');
    })
    .catch((error) => {
        console.error('压缩失败', error);
    });