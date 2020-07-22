function getRandomId() {
  let maxNumber = 99999999
  let minNumber = 1000000
  let range = maxNumber - minNumber; //取值范围的差
  let random = Math.random(); //小于1的随机数
  return minNumber + Math.round(random * range);
}

// 文件转 Blob (url)
function getObjectURL(file) {
  if (window.createObjcectURL != undefined) {
    getObjectURL = file => window.createOjcectURL(file);
  } else if (window.URL != undefined) {
    getObjectURL = file => window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    getObjectURL = file => window.webkitURL.createObjectURL(file);
  }
  return getObjectURL(file)
}

// 网络图片转 Base64
function convertImgToBase64(src, callback, outputFormat = 'image/png') {
  return new Promise((resolve, reject) => {

    let canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous'

    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL(outputFormat)
      canvas = null;

      resolve(dataURL)
    }

    img.onerror = function(){
      reject()
    }

    img.src = src;
  })
}

// 网络图片转 Blob
async function convertImgToBlob (src, format = 'image/png'){
  let dataurl = await convertImgToBase64(src, format)
  return dataURItoBlob(dataurl)
}

// Base64 转 Blob 对象
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Base64 转 Blob 对象
function dataURItoBlob(base64Data) {  
  var byteString;
  if(base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64Data.split(',')[1]);
  } else {
    byteString = unescape(base64Data.split(',')[1]);
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  }
  var ia = new Uint8Array(byteString.length);
  for(var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type: mimeString})
}

// Base64 转 file
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Blob 对象转 Base64
function blobToDataURL(blob, callback) { 
  let a = new FileReader();
  a.onload = function (e) { 
    callback(e.target.result); 
  }
  a.readAsDataURL(blob);
}

/**
* debounce         防抖
* { fn }            待执行函数
* { delay }         延时时间
* { immediate }     是否立即执行
*/
function debounce(fn, delay = 500, immediate = false){
  let timer = null
  return function(){
    let that = this, _args = arguments
    if(timer) clearTimeout(timer)
    if(immediate){
      if(!timer){
        fn.call(that, _args)
      }
      timer = setTimeout(()=>{
        timer = null
      }, delay)
    }else{
      timer = setTimeout(() => {
        fn.call(that, _args)
      }, delay)
    }
  }
}

/**
* throttle          节流
* { fn }            待执行函数
* { delay }         延时时间
*/
function throttle(fn, delay = 500){
  let last = 0
  return function(){
    let curr = +new Date()
    if (curr - last > delay){
      fn.apply(this, arguments)
      last = curr
    }
  }
}

export {
	getRandomId,
  getObjectURL,
  convertImgToBase64,
  dataURLtoBlob,
  dataURItoBlob,
  dataURLtoFile,
  convertImgToBlob,
  blobToDataURL,
  debounce,
  throttle
}
