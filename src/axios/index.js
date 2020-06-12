import Vue from 'vue'
import axios from "axios"
import moqui from '../assets/js/moquiLibs'
import store from '../assets/js/localStorage'

const Axios = axios.create({
  baseURL: "/",
  // 设置请求的超时时间，默认为25s
  timeout: 25000,
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    // 'Accept':'*/*',
    // 'Content-Type': 'application/x-www-form-urlencoded'
  }
})


//请求拦截
Axios.interceptors.request.use(
  config => {
    let token = store.get("moquiSessionToken")
    config.headers.moquiSessionToken = token
    //创建cancel token
    config.cancelToken = new axios.CancelToken(cancel => {
      moquiVue.axiosRequest.push({cancel})
    })
    // if (config.method == 'post') {
    //   // if (token) {
    //   //   if (typeof config.data.get == "undefined") {
    //   //     var objData = config.data
    //   //   } else {
    //   //     var objData = {}
    //   //     config.data.forEach((value, key) => objData[key] = value)
    //   //   }
    //   //   // config.headers.Authorization = token
    //   //   config.data = {
    //   //     ...objData,
    //   //     "moquiSessionToken": token,
    //   //   }
    //   // }
    //   config.headers.moquiSessionToken = token
    // } else {
    //   config.headers.moquiSessionToken = token
    // }

    return config
  },
  error => {
    return Promise.reject(err)
  }
)

//响应拦截
Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status == 401) {
        store.remove("moquiSessionToken")
        let bus = moquiVue.eventBus
        bus.$emit("global_logout")
      }

      switch (error.response.status) {
        case 404:
          break;
        case 401:
          break;
        case 500:
          break
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }

)
export default Axios