const fs = require('fs');
const path = require("path")
const qiniu = require('qiniu')
const ora = require('ora')
const request = require('request');

const versionPlugin = require('./resource-file')
const appConfig = require('../config')
const filesRegx = /^(static|img|fonts)(.*?)/
const isUploadStatic = process.env['npm_config_static'] ? true : false
const mimeType = {
  "gif":"image/gif",
  "png":"image/png",
  "jpg":"image/jpg",
  "jpeg":"image/jpeg",
  "js":"application/javascript",
  "json": "application/json",
  "gz":"application/x-gzip",
  "css":"text/css",
  "html":"text/html",
  "woff2":"font/woff2",
  "woff":"font/woff",
  "ttf":"font/ttf",
  "eot":"font/eot",
  "md":"text/x-markdown",
  "svg":"image/svg+xml"
}

class QiniuUpload {
  constructor(config) {
    this.accessKey = config.accessKey
    this.secretKey = config.secretKey
    this.bucket = config.bucket
    this.zone = config.zone
    this.publicPath = config.publicPath
    
    //认证信息鉴权
    this.mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
    this.qiniuConfig = new qiniu.conf.Config()
    //空间对应的机房
    this.qiniuConfig.zone = qiniu.zone[config.zone]

    //上传对象定义
    this.formUploader = new qiniu.form_up.FormUploader(this.qiniuConfig)

    //空间管理
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.qiniuConfig)

    //cdn 刷新文件
    this.cdnManager = new qiniu.cdn.CdnManager(this.mac);
    this.refreshFiles = []

    //失败文件
    this.errorFiles = []

    this.resourceName = config.resourceName
    this.root = config.root ? config.root : 'dist'

    this.chunkFile = []
  }
  apply(compiler) {
    compiler.plugin('done', data => {
      //刪除旧文件
      this.delete()     
      this.start(data.compilation.assets)
    });
  }
  async start(objectData) {
    console.log('七牛云开始上传')
    for (const file in objectData) {
      if(!filesRegx.test(file)) {
        let webfileUrl = this.publicPath + file
        this.refreshFiles.push(webfileUrl)
      }
      if(isUploadStatic || !filesRegx.test(file)) {
        // await this.waitTime(1000)
        const resp = await this.uploadFile(file)
        if(resp.code != 200) {
          this.errorFiles.push(resp.key)
        }
      }
    }
    //上传资源文件
    await this.uploadFile(this.resourceName)
    let resourceUrl = this.publicPath + this.resourceName
    this.refreshFiles.push(resourceUrl)

    console.log('🎉 七牛云上传完毕')
    console.log("失败文件列表 => ",this.errorFiles)
    console.log("刷新文件列表 => ",this.refreshFiles)

    //刷新cdn
    this.cdnManager.refreshUrls(this.refreshFiles, function(err, respBody, respInfo) {
      if(err) {
        console.log(err,"cdn刷新失败")
      }
      if (respInfo.statusCode == 200) {
        console.log("cdn刷新成功")
      }
    });

  }
  async resourceFile() {
    const resource = new versionPlugin({
      versionDirectory: appConfig.build.assetsRoot,
      fileName: this.resourceName,
    })
    resource.readFile()
  }
  async uploadFile(filePath,options) {
    const localFile = appConfig.build.assetsRoot+ "/" + filePath
    const key = filePath ;

    return new Promise((resolve, reject) => {
      if(!options) {
        options = {
          scope: this.bucket
        };
      }
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(this.mac);      
      // 文件上传
      const spinner = ora(`文件${key}开始上传`).start();
      const putExtra = new qiniu.form_up.PutExtra()
      putExtra.mimeType = this.getFileMimeType(key)
      this.formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr,respBody, respInfo) => {
        if (respErr) {
          reject({
            code: 101,
            msg: "上传失败",
            key: key
          })
        }
        if (respInfo.statusCode == 200) {
          resolve({
            code: 200,
            msg: "上传成功"
          });
          spinner.succeed(`文件${key}上传成功!`);
        } else {
          if ((respInfo.status === 614 || respInfo.statusCode === 614)) {
            spinner.fail(`文件${key}已存在，尝试覆盖上传！`);
            let coverOpt = {
              scope: this.bucket + ':' + filePath
            }
            resolve(
              this.uploadFile(filePath,coverOpt)
            );
          } else {
            reject({
              code: 102,
              msg: "上传失败",
              key: key
            })
          }
        }
      })
    })
  }
  //等待时间
  async waitTime(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve()
      }, time);
    })
  }
  getFileMimeType(file) {
    let fileSplit = file.split(".")
    let ext = fileSplit[fileSplit.length-1].toLowerCase()
    return mimeType[ext]
  }
  delete() {
    const resourceType = ['app','manifest','vendor']
    let versionApi = this.publicPath + this.resourceName
    request(versionApi,(error, response, body) => {
      if(!error && response.statusCode == 200) {
        let resp = JSON.parse(body)
        var deleteOperations = []
        resp.files.map(item => {
          if(resourceType.indexOf(item.split(".")[0]) > -1) {
            deleteOperations.push(qiniu.rs.deleteOp(this.bucket,item))
            deleteOperations.push(qiniu.rs.deleteOp(this.bucket,item+".gz"))
          }
        })
        this.bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
          if (err) {
            console.log(err);
            //throw err;
          } else {
            // 200 is success, 298 is part success
            if (parseInt(respInfo.statusCode / 100) == 2) {
              respBody.forEach(function(item) {
                if (item.code == 200) {
                  console.log(item.code + "\tsuccess");
                } else {
                  console.log(item.code + "\t" + item.data.error);
                }
              });
            } else {
              console.log(respInfo.deleteusCode);
              console.log(respBody);
            }
          }
        });
      }
    })
  }
  async readFile(pathParam) {
    let _self = this
    const filePath = path.resolve(pathParam);
    let arr = []
    const fsRead = async function read(filePath) {
      await fs.stat(filePath,async (err,stats) => {
        if(stats.isDirectory()) {
          await fs.readdir(filePath, function (err, file) {
            file.forEach((e) => {
                var absolutePath = path.resolve(path.join(filePath, e));
                read(absolutePath)
            })
          })  
        } else {
          let newPath = filePath.split(_self.root)[1].substr(1)
          console.log(newPath)
          arr.push(newPath)
          // _self.uploadFile(newPath)
        }
      })
    }
    await fsRead(filePath)
    console.log(arr)
  }
}

module.exports = QiniuUpload