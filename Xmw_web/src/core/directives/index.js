// 批量注册Vue指令
import action from './action'
import copy from './copy'
import longpress from './longpress'
import debounce from './debounce'
import throllte from './throllte'
import emoji from './emoji'
import LazyLoad from './lazyLoad'
import permission from './permission'
import waterMarker from './waterMarker'
import draggable from './draggable'
import wave from './wave'
// 自定义指令
const directives = {
    action,
    copy,
    longpress,
    debounce,
    throllte,
    emoji,
    LazyLoad,
    permission,
    waterMarker,
    draggable,
    wave
}

export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key])
        })
    },
}