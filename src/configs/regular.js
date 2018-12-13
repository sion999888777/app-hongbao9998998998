
// 手机号
export const phoneReg = /^((\+\d{2,4}))?\d{6,16}$/

// 密码 (注册、修改密码)
export const pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

// 短信验证码
export const codeReg = /^\d{4}$/

// 提现密码 - 6位数字
export const codeSix = /^\d{6}$/

// 数字、中文、英文、10个以内 - 房间名字
export const roomNameReg = /^[A-Za-z0-9\u4e00-\u9fa5]{0,10}$/  

// 数字、中文、英文、10个以内 - 昵称名字
export const nameReg = /^[A-Za-z0-9\u4e00-\u9fa5]{0,8}$/  
