
import request from '@/utils/request'
import axios from 'axios'

export function getGrpList(params) {
  return request({
    url: process.env.VUE_APP_BASE_API+'prjGrp/list',
    method: 'get',
    params
  })
}
export function save(params) { 
  return axios.post(process.env.VUE_APP_TPL_API + 'msg/save', params)
}

export function del(params) {
  let id=JSON.stringify(params); 
  return axios.delete( process.env.VUE_APP_TPL_API + 'msg/delete/'+id) 
}

export function update(params) {
  return axios.post(  process.env.VUE_APP_TPL_API + 'msg/update',   params )
}

export function list(params) {   
  return axios.get(  process.env.VUE_APP_TPL_API + 'msg/list/'+params )
}

 
 

// export function savePrj(params) {
//   return request({
//     url: 'prj/save',
//     method: 'post',
//     params
//   })
// }

