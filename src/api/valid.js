 // <!--验证手机号是否合法-->
 
export const checkTel = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else if (value.length<5) {
    callback(new Error('手机号码不合法'))
  } else {
    callback()
  }
}