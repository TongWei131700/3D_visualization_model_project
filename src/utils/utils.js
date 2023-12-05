/**
 * 时间格式化
 * @param {Date} date
 * @param {String} format
 */
function FormatTime(timeStamp, format = 'yyyy-MM-dd hh:mm:ss') {
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
 * 格式化数字序号
 * @param {Number} num
 */
function FormatSerialNumber(num) {
  return ('0' + num).slice(-2)
}

/**
 * 功能：滚动列表
 * @param {String} scrollId 滚动容器的唯一标识
 * @param {Number} scrollNum 滚动的长度
 * @param {Number} scrollDistance 滚动的距离 +表示从上到下 -表示从下到上
 * @param {Strig} scrollUnit 滚动的单位 px rem em
 * @param {Number} scrollTime 滚动的时间间隔 单位为ms
 */
function ScrollList(scrollId, scrollNum, scrollDistance, scrollUnit, scrollTime) {
  const scrollCon = document.getElementById(scrollId)
  if (scrollCon == null) {
    return false
  }
  let start = 0 // 开始标记
  let intervalId // 轮询id
  const scrollFunction = function () { // 轮询id
    scrollCon.style.top = scrollDistance * start + scrollUnit
    if (start > scrollNum - 1) {
      start = 0
    } else {
      start++
    }
    scrollCon.setAttribute('start', start)
  }
  scrollCon.insertAdjacentHTML('beforeend', scrollCon.innerHTML)
  scrollCon.style.position = 'absolute'
  scrollCon.style.overflow = 'hidden'
  if (!(scrollCon.getAttribute('intervalId') == null || scrollCon.getAttribute('intervalId') === '')) {
    intervalId = scrollCon.getAttribute('intervalId')
    clearInterval(intervalId)
    start = scrollCon.getAttribute('start')
  }

  intervalId = setInterval(scrollFunction, scrollTime)
  scrollCon.setAttribute('intervalId', intervalId)
  scrollCon.onmouseover = function () {
    clearInterval(intervalId)
    scrollCon.setAttribute('intervalId', '')
  }
  scrollCon.onmouseout = function () {
    intervalId = setInterval(scrollFunction, scrollTime)
    scrollCon.setAttribute('intervalId', intervalId)
  }
}

/**
 * 功能：进行深拷贝
 */
function deepCopy(origin) {
  if (origin === undefined || origin == null) {
    return origin
  }
  const target = origin instanceof Array ? [] : {}
  for (const [key, value] of Object.entries(origin)) {
    target[key] = typeof value === 'object' ? deepCopy(value) : value
  }
  return target
}

export {
  FormatTime,
  FormatSerialNumber,
  ScrollList,
  deepCopy
}
