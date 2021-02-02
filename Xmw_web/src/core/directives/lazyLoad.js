const throttle = (callback, delay) => {
    let timer = null
    return function wrapper() {
        const _this = this
        const args = arguments
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            callback.apply(_this, args)
            clearTimeout(timer)
            timer = null
        }, delay)
    }
}
/**
* 判断元素是否进入可视区域
*/
const isElementInViewport = el => {
    if (typeof el.getBoundingClientRect !== 'function') {
        return true
    }

    const clientHeight = _getClientHeight()
    const rect = el.getBoundingClientRect()
    return rect.top < clientHeight
}

const _getClientHeight = () => {
    const dClientHeight = document.documentElement.clientHeight
    const bodyClientHeight = document.body.clientHeight
    let clientHeight = 0

    if (bodyClientHeight && dClientHeight) {
        clientHeight = bodyClientHeight < dClientHeight ? bodyClientHeight : dClientHeight
    } else {
        clientHeight = bodyClientHeight > dClientHeight ? bodyClientHeight : dClientHeight
    }

    return clientHeight
}
const lazyImgAction = (el, binding) => {
    if (isElementInViewport(el)) {
        el.src = binding.value.src
        binding.value.callback(el)
    } else {
        // use el as key
        window.lazyMap.set(el, {
            el,
            value: binding.value
        })
    }
}
const LazyLoad = {
    bind: function (el) {
        // set default src when load onerror
        el.onerror = () => {
            el.src =
                'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/532f0ad2675942efb12ab7f4efa7885a~tplv-k3u1fbpfcp-zoom-1.image'
        }
        if (!window.lazyMap) {
            // 创建 map 来缓存
            window.lazyMap = new Map()
            // 监听滚动事件，添加方都处理
            window.onscroll = throttle(() => {
                window.lazyMap.forEach((lazyImg, key) => {
                    if (isElementInViewport(lazyImg.el)) {
                        lazyImg.el.src = lazyImg.value.src
                        lazyImg.value.callback(lazyImg.el)
                        window.lazyMap.delete(key)
                    }
                })
            }, 200)
        }
    },
    inserted: (el, binding) => {
        lazyImgAction(el, binding)
    },
    componentUpdated: (el, binding) => {
        // if the src not change
        if (binding.value.src === binding.oldValue.src) {
            return false
        }
        lazyImgAction(el, binding)
    },
    unbind: (el, binding) => {
        const key = binding.value.src
        if (window.lazyMap && window.lazyMap.has(key)) {
            window.lazyMap.delete(key)
        }
    }
}


export default LazyLoad
