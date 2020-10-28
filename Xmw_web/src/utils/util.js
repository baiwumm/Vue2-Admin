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