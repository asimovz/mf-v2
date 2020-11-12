var FStream = require('fs');

function Version(options) {
    this.options = options || {};
    !this.options.versionDirectory && (this.options.versionDirectory = 'static');
}

Version.prototype.apply = function(compiler) {
	var self = this;
    compiler.plugin('emit', function(compilation, callback) {
    	let hash = compilation.getStats().hash
		var dir_path = this.options.context + '/' + self.options.versionDirectory;
        var version_file = dir_path + '/version.json';
        var content = '{"version":"' + hash + '","timestamp": '+ new Date().getTime() +'}';

        FStream.exists(dir_path, function(exist) {
            if (exist) {
                writeVersion(self, version_file, content);
                return;
            }
            FStream.mkdir(dir_path, function(err) {
                if (err) throw err;
                console.log('\n创建目录[' + dir_path + ']成功');
                writeVersion(self, version_file, content);
            });
        });
        callback()
    });
};


const writeVersion = (self, versionFile, content) => {
    console.log("开始生成版本文件");
    //写入文件
    FStream.writeFile(versionFile, content, function (err) {
        if (err) throw err;
        console.log("版本信息生成成功!");
    });
}
module.exports = Version;

