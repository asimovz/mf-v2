const FStream = require('fs');
const resourceType = ['app','manifest','vendor']
const jsRegx = /(.*?)\.js$/
const cssRegx = /(.*?)\.css$/
const resourceFile = {
	css:['static/init.css'],
	js:['static/js/jquery-3.1.1.min.js']
}


function Version(options) {
	this.options = options || {};
	!this.options.versionDirectory && (this.options.versionDirectory = 'static');
}

Version.prototype.apply = function (compiler) {
	var self = this;
	compiler.plugin('done', function (data, callback) {
		const chunks = data.compilation.namedChunks
		const chunkArr = Object.keys(data.compilation.namedChunks)

		chunkArr.reverse().map(item => {
			let files = chunks[item].files
			files.map(child => {
				if(cssRegx.test(child)) resourceFile.css.push(child)
				if(jsRegx.test(child) && resourceType.indexOf(item) > -1) resourceFile.js.push(child)
			})
		})
		let moquiResource = [...resourceFile.css,...resourceFile.js]
		self.write(moquiResource)
	});
	
};

Version.prototype.readFile = function() {
	let filePath = this.options.versionDirectory
	let moquiResource = []
	FStream.readdir(filePath, (err, files) => {
		files.forEach((filename) => {
			if(resourceRegx.test(filename)) {
				moquiResource.push(filename)
			}
		})
		moquiResource = []
		this.write(moquiResource)
	})
}

Version.prototype.write = function(content) {
	let path = this.options.versionDirectory +"/"+ this.options.fileName
	const writeContent = '{"files":' + JSON.stringify(content) + ',"timestamp": '+ new Date().getTime() +'}';
	FStream.writeFile(path, writeContent, function (err) {
		console.log("📦 资源文件生成成功!");
	});
}
module.exports = Version;

