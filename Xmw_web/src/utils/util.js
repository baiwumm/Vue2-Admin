import config from '@/config/defaultSettings'
import CryptoJS from 'crypto-js'
export const setDocumentTitle = function (title) {
    document.title = title
    const ua = navigator.userAgent
    // eslint-disable-next-line
    const regex = /\bMicroMessenger\/([\d\.]+)/
    if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        const i = document.createElement('iframe')
        i.src = '/favicon.ico'
        i.style.display = 'none'
        i.onload = function () {
            setTimeout(function () {
                i.remove()
            }, 9)
        }
        document.body.appendChild(i)
    }
}

export const domTitle = config.title
export const crypto_key = CryptoJS.enc.Utf8.parse('ABCDEF0123456789') //十六位十六进制数作为密钥
export const crypto_iv = CryptoJS.enc.Utf8.parse('ABCDEF0123456789') //十六位十六进制数作为密钥偏移量

export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '夜深了'
}

export function welcome() {
    const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

export function isIE() {
    const bw = window.navigator.userAgent
    const compare = (s) => bw.indexOf(s) >= 0
    const ie11 = (() => 'ActiveXObject' in window)()
    return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
    if (id === '') {
        return
    }
    setTimeout(() => {
        document.body.removeChild(document.getElementById(id))
    }, timeout)
}

/**
 * @param value 值
 * @param fmt 日期格式
 * @param type 0为默认形式,1为日历模式,不写则使用默认形式
 */
//js中使用  this.$options.filters.dataFormat(new Date(),"yyyy-MM-dd hh:mm:ss",1);
//vue中使用 '2019-01-01' | dataFormat("yyyy-MM-dd hh:mm:ss",1);
export const dataFormat = (value, fmt, type) => {
    if (type) return ifDate(value, fmt);
    else return timeTo(value, fmt);

    //判断当前返回的是星期几
    function week(dayNum) {
        if (dayNum == 7) return "日";
        else if (dayNum == 1) return "一";
        else if (dayNum == 2) return "二";
        else if (dayNum == 3) return "三";
        else if (dayNum == 4) return "四";
        else if (dayNum == 5) return "五";
        else if (dayNum == 6) return "六";
    }

    function timeTo(value, fmt) {
        if (!value || value == "") return value;
        if (typeof value == "string" && value.indexOf(".") > -1)
            value = value.split(".")[0]; //时间格式带小数点则需把小数点后面的尾数去掉
        let getDate = new Date(value);
        let o = {
            "M+": getDate.getMonth() + 1,
            "d+": getDate.getDate(),
            "h+": getDate.getHours(),
            "m+": getDate.getMinutes(),
            "s+": getDate.getSeconds(),
            "q+": Math.floor((getDate.getMonth() + 3) / 3),
            S: getDate.getMilliseconds(),
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (getDate.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    }

    function ifDate(value, fmt) {
        if (!value || value == "") return value;
        let date = new Date(new Date().toLocaleDateString()).getTime(); //获取当前时间时间戳
        let perDate = new Date(new Date(value).toLocaleDateString()).getTime();
        let day = parseInt((date - perDate) / 86400 / 1000); //获取相差的天数，可以为负数
        let nowday = new Date(date).getDay(); //获取当前时间是星期几，0-6
        if (nowday == 0) {
            //如果为0的话，把周日赋值为7   1-7分别对应周一到周日
            nowday = 7;
        }
        const hour = timeTo(value, "hh");
        let hourText = "";
        if (hour < 12) hourText = " 上午";
        else hourText = " 下午";
        let timeText = hourText + timeTo(value, "hh:mm:ss");

        if (day == 0) return "今天 " + timeText;
        //今天
        else if (day == 1) return "昨天" + timeText;
        //昨天
        else if (day == 2) return "前天" + timeText;
        //前天
        else if (day == -1) return "明天" + timeText;
        //明天
        else if (day == -2) return "后天" + timeText;
        //后天
        else if (day > 2 && day < nowday) {
            //判断是否是当前周而不是上一周
            var dayNum = nowday - day;
            return "周" + week(dayNum) + timeText;
        } else if (day > 2 && day >= nowday && day < nowday + 7) {
            //判断是否是上一周
            var dayNum = 7 - Math.abs(nowday - day);
            return "上周" + week(dayNum) + timeText;
        } else if (day >= nowday + 7) {
            //判断是不是超过上一周，显示正常时间格式
            return timeTo(value, fmt);
        } else if (Math.abs(day) <= 7 - nowday && day < 0) {
            //判断是否是当前周，不是下一周
            var dayNum = Math.abs(day) + nowday;
            return "周" + week(dayNum) + timeText;
        } else if (
            Math.abs(day) > 7 - nowday &&
            Math.abs(day) < 7 - nowday + 7 &&
            day < 0
        ) {
            var dayNum = Math.abs(day) + nowday - 7; //判断是否是下一周
            return "下周" + week(dayNum) + timeText;
        } else if (Math.abs(day) > 7 - nowday + 7 && day < 0) {
            //判断是否超过下一周，显示正常格式
            return timeTo(value, fmt);
        }
    }
};

/**
 * 数组转树形结构
 * @param source 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export const treeData = (source, id, parentId, children) => {
    let temp = JSON.parse(JSON.stringify(source))
    // 以id为键，当前对象为值，存入一个新的对象中
    let tempObj = {}
    for (let i in temp) {
        tempObj[temp[i][id]] = temp[i]
    }
    return temp.filter((father) => {
        // 把当前节点的所有子节点找到
        let childArr = temp.filter((child) => father[id] == child[parentId])
        childArr.length > 0 ? (father[children] = childArr) : ''
        // 只返回第一级数据；如果当前节点的fatherId不为空，但是在父节点不存在，也为一级数据
        return father[parentId] === null || !tempObj[father[parentId]]
    })
};

// 相对时间
export const relativeTime = (ele) => {
    var lr = new Date(ele);
    var now = new Date;
    var dt = now - lr;
    var s = dt / 1000;
    var m = s / 60;
    var h = m / 60;
    if (s < 60) {
        return s + '秒前';
    } else if (s < 3600) {
        return parseInt(s / 60) + '分钟前';
    } else if (s < 86400) {
        return parseInt(s / 60 / 60) + '小时前';
    } else if (s < 604800) {//在一周内
        return parseInt(s / 60 / 60 / 24) + '天前';
    } else if (s < 2592000) {
        return parseInt(s / 60 / 60 / 24 / 7) + "周前"
    } else if (s < 2592000 && s > 604800) {//超过一周
        return parseInt(s / 60 / 60 / 24) + '天前';
    } else if (s < 31104000) {
        return parseInt(s / 60 / 60 / 24 / 30) + '月前';
    } else if (s < 311040000) {
        return parseInt(s / 60 / 60 / 24 / 30 / 12) + '年前';
    }
}

// 设置车牌颜色
export const setVLPNColor = (VLPNColor) => {
    const vlpn_c = {
        "01": {
            Background: "rgb(105, 131, 239)",
            BorderColor: "#ffffff",
            TextColor: "#ffffff",
        },
        "02": {
            Background: "rgb(255, 228, 149)",
            BorderColor: "#000",
            TextColor: "#000000",
        },
        "03": {
            Background: "rgb(125, 125, 125)",
            BorderColor: "#ffffff",
            TextColor: "#ffffff",
        },
        "04": { Background: "#ffffff", BorderColor: "#000", TextColor: "#000000" },
        "05": {
            Background: "rgba(158, 236, 169, 0.58)",
            BorderColor: "#6da067",
            TextColor: "#000",
        },
    }
    if (!vlpn_c[VLPNColor]) return {};
    let vlpn_c_sty = vlpn_c[VLPNColor];
    return {
        display: "inline-block",
        margin: "-2 auto",
        "border-radius": "6px",
        "border-style": "double",
        "text-align": "center",
        "line-height": "21px",
        "height": "25px",
        padding: "0px 2px",
        background: `${vlpn_c_sty.Background}`,
        color: `${vlpn_c_sty.TextColor}`,
        "border-color": `${vlpn_c_sty.BorderColor}`,
        "font-weight": "bold",
        "font-size": "10pt"
    };
}

// 千位格式化数字
export const filterDigital = (value, decimal) => {
    if (!value) {
        return '0'
    }
    const intPartFormat = (+value || 0).toFixed(decimal).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') // 将整数部分逢三一断
    return intPartFormat
}

// 验证码模块
// 生成一个随机数
export const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
}
// 生成一个随机的颜色
export const randomColor = (min, max) => {
    let r = randomNum(min, max)
    let g = randomNum(min, max)
    let b = randomNum(min, max)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
}
export const _code_chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']