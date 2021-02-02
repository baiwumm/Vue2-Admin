// 思路：
// 1、设置需要拖拽的元素为相对定位，其父元素为绝对定位。
// 2、鼠标按下(onmousedown)时记录目标元素当前的 left 和 top 值。
// 3、鼠标移动(onmousemove)时计算每次移动的横向距离和纵向距离的变化值，并改变元素的 left 和 top 值
// 4、鼠标松开(onmouseup)时完成一次拖拽

const dragable = {
    bind(el) {
        el.style.cssText += ";cursor:move;";
        el.style.cssText += ";left:0px;top:0px;";

        // 兼容获取dom元素样式属性
        const getStyle = (function () {
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr];
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr];
            }
        })();

        el.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;
            const disY = e.clientY - el.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL = getStyle(el, "left");
            let styT = getStyle(el, "top");

            if (styL.includes("%")) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, "") / 100);
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, "") / 100);
            } else {
                styL = +styL.replace(/\px/g, "");
                styT = +styT.replace(/\px/g, "");
            }

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX;
                let top = e.clientY - disY;

                // 移动当前元素
                el.style.cssText += `;left:${left}px;top:${top}px;`;
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        // 拖拽还原
        // el.onmouseup = () => {
        //   el.style.cssText += `;position: relative;top: 0;left: 0;`;
        // };
    },
    unbind(el) {
        el.onmousedown = null;
    },
};

export default dragable;