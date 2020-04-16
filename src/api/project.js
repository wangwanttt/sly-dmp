import request from '@/utils/request'
import axios from 'axios'
export function getList(params) {
  return request({
    url: 'prj/list',
    method: 'get',
    params
  })
}
export function savePrj(params) {
  return axios.post(process.env.VUE_APP_BASE_API + 'prj/save', params)
}

export function delPrj(params) {
  let id=JSON.stringify(params); 
  return axios.delete( process.env.VUE_APP_BASE_API + 'prj/delete/'+id) 
}

export function updatePrj(params) {
  return axios.post(  process.env.VUE_APP_BASE_API + 'prj/update',   params )
}

export function getOrderList(params) {
  return axios.post(  process.env.VUE_APP_BASE_API + 'getOrderList',   params )
}


export function getGrpList(params) {
  return request({
    url: 'prjGrp/list',
    method: 'get',
    params
  })
}

export function savePrjGrp(params) {
  return axios.post(process.env.VUE_APP_BASE_API + 'prjGrp/save', params)
}

export function delPrjGrp(params) {
  let id=JSON.stringify(params); 
  return axios.delete( process.env.VUE_APP_BASE_API + 'prjGrp/delete/'+id) 
}

export function updatePrjGrp(params) {
  return axios.post(  process.env.VUE_APP_BASE_API + 'prjGrp/update',   params )
}

 

// export function savePrj(params) {
//   return request({
//     url: 'prj/save',
//     method: 'post',
//     params
//   })
// }

