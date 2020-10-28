module.exports = {
    dataFormat(value, fmt) {
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
};
