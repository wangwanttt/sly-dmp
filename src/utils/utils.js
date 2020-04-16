export function  countStr(  str1,   str2) {  
    if (str1.indexOf(str2) == -1) {  
        return 0;  
    } else if (str1.indexOf(str2) != -1) {  
        counter++;  
        countStr(str1.substring(str1.indexOf(str2) +  
               str2.length()), str2);  
           return counter;  
    }  
        return 0;  
}   
 
// date原型链对象添加format方法，用于format日期格式
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
 
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
 
  return fmt
}
 