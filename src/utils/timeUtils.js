export function gainCurrentTime() {
  const date = new Date()
  const year = date.getFullYear() // 年
  const month = date.getMonth() + 1 // 月
  const day = date.getDate() // 日
  const weekNumber = date.getDay() // 星期
  const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let hour = date.getHours() // 时
  hour = hour < 10 ? '0' + hour : hour // 如果只有一位，则前面补零
  let minute = date.getMinutes() // 分
  minute = minute < 10 ? '0' + minute : minute // 如果只有一位，
  let second = date.getSeconds() // 秒
  second = second < 10 ? '0' + second : second // 如果只有一位，则前面补零
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    week: weekArr[weekNumber]
  }
}

export function FormatTime(timeStamp, format = 'yyyy-MM-dd hh:mm:ss') {
  const date = new Date(timeStamp)
  const config = {
    yyyy: date.getFullYear(),
    MM: ('0' + (date.getMonth() + 1)).slice(-2),
    dd: ('0' + date.getDate()).slice(-2),
    hh: ('0' + date.getHours()).slice(-2),
    mm: ('0' + date.getMinutes()).slice(-2),
    ss: ('0' + date.getSeconds()).slice(-2)
  }
  for (const key in config) {
    format = format.replace(key, config[key])
  }
  return format
}

/**
 * 字符串转日期Date
 * @param strDate
 * @returns {Date}
 */
export function stringToDate(strDate) {
  let tempStrs = strDate.split(" ");
  let dateStrs = tempStrs[0].split("-");
  let year = parseInt(dateStrs[0], 10);
  let month = parseInt(dateStrs[1], 10) - 1;
  let day = parseInt(dateStrs[2], 10);
  let timeStrs = tempStrs[1].split(":");
  let hour = parseInt(timeStrs [0], 10);
  let minute = parseInt(timeStrs[1], 10);
  let second = parseInt(timeStrs[2], 10);
  let date = new Date(year, month, day, hour, minute, second);
  return date;
}

/**
 * 日期Date格式化为字符串
 * @param date
 * @param fmt
 * @returns {*}
 */
export function format(date, fmt) {
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
        (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
