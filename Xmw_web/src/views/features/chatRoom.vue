<template>
    <page-header-wrapper
        content="基于websocket的仿微信聊天室,向指定的客户端发送消息,websocket在即时通讯、通知与消息推送，实时分析等场景中有较为广泛的应用。"
    >
        <div class="chat-container">
            <div class="wechat">
                <div class="sidestrip">
                    <div class="am-dropdown">
                        <div class="own_head" @click="dropContent = !dropContent">
                            <a-avatar :src="user.avatar" v-if="user.avatar" />
                            <a-avatar v-else class="user-avatar">
                                {{ user.CnName.charAt(user.CnName.length - 1) }}
                            </a-avatar>
                        </div>
                        <div class="am-dropdown-content" v-show="dropContent">
                            <div class="own_head_top">
                                <div class="own_head_top_text">
                                    <p class="own_name">
                                        {{ user.CnName
                                        }}<a-icon
                                            :type="user.SEX ? 'man' : 'women'"
                                            style="color: #46b6ef; font-size: 14px; margin-left: 10px"
                                        />
                                    </p>
                                    <div class="own_numb">手机号:{{ user.Phone }}</div>
                                </div>
                                <a-avatar :src="user.avatar" shape="square" :size="64" style="float: right" />
                            </div>
                            <div class="own_head_bottom">
                                <p><span>地区</span>{{ address }}</p>
                                <p><span>部门</span>{{ department }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="sidestrip_icon">
                        <span
                            ><a-icon
                                type="message"
                                :style="{ color: '#09bb07', 'font-size': '24px' }"
                                @click="showMiddle = true"
                        /></span>
                    </div>
                    <div class="sidestrip_bc"><a-icon type="menu" style="font-size: 24px; color: #8c8c8c" /></div>
                </div>
                <div class="middle">
                    <div class="wx_search">
                        <a-input-search placeholder="输入点什么" v-model="keyword" @change="search" />
                    </div>
                    <div class="office_text">
                        <ul class="user_list">
                            <template v-for="(v, i) in userList.filter((v) => v.UserID != user.UserID)">
                                <li
                                    :key="i"
                                    :style="{ background: v.UserID == user_active ? '#dedbdb' : null }"
                                    @click="changeUser(v.UserID, v.CnName)"
                                >
                                    <div class="user_head">
                                        <a-badge :count="v.unreadMsg">
                                            <a-avatar :src="v.avatar" shape="square" :size="40" v-if="v.avatar" />
                                            <a-avatar shape="square" :size="40" v-else class="user-avatar">{{
                                                v.CnName.charAt(v.CnName.length - 1)
                                            }}</a-avatar>
                                        </a-badge>
                                    </div>
                                    <div class="user_text">
                                        <p class="user_name">{{ v.CnName }}</p>
                                        <p class="user_message" v-html="parMsg(v.lastMsg)"></p>
                                    </div>
                                    <div class="user_time">
                                        {{ formatTime(v.createTime) }}
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
                <div class="talk_window">
                    <div class="windows_top">
                        <div class="windows_top_box">
                            <span>{{ msg_active }}</span>
                        </div>
                    </div>
                    <div class="windows_body">
                        <div
                            class="office_text"
                            style="height: 100%; overflow: hidden; overflow-y: auto"
                            ref="msgContent"
                        >
                            <ul class="content" id="chatbox">
                                <template v-for="(v, i) in chatList">
                                    <li class="me" v-if="v.UserID == user.UserID && v.ToUserID == user_active" :key="i">
                                        <a-avatar
                                            :src="user.avatar"
                                            shape="square"
                                            :size="35"
                                            style="float: right"
                                            v-if="user.avatar"
                                        />
                                        <a-avatar
                                            shape="square"
                                            :size="35"
                                            style="float: right"
                                            v-else
                                            class="user-avatar"
                                            >{{ user.CnName.charAt(user.CnName.length - 1) }}</a-avatar
                                        >
                                        <span class="me_msg" v-html="parMsg(v.Content)"></span>
                                    </li>
                                    <li
                                        class="other"
                                        v-if="v.UserID == user_active && v.ToUserID == user.UserID"
                                        :key="i"
                                    >
                                        <a-avatar
                                            :src="v.avatar"
                                            shape="square"
                                            :size="35"
                                            style="float: left"
                                            v-if="v.avatar"
                                        />
                                        <a-avatar
                                            shape="square"
                                            :size="35"
                                            style="float: left"
                                            v-else
                                            class="user-avatar"
                                            >{{ v.CnName.charAt(v.CnName.length - 1) }}</a-avatar
                                        >
                                        <span class="other_msg" v-html="parMsg(v.Content)"></span>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                    <div class="windows_input" id="talkbox">
                        <div class="input_icon">
                            <span>
                                <a-popover trigger="click" placement="topLeft">
                                    <template #content>
                                        <VEmojiPicker @select="selectEmoji" />
                                    </template>
                                    <a-icon type="smile" style="font-size: 24px; cursor: pointer" />
                                </a-popover>
                            </span>
                        </div>
                        <div class="input_box">
                            <a-textarea
                                placeholder="输入点什么"
                                id="input_box"
                                v-model.trim="msgContent"
                                @pressEnter="sendMsg"
                            />
                            <a-button id="send" @click="sendMsg">发送(S)</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </page-header-wrapper>
</template>

<script>
import { getChatRecord, saveCharMsg } from '@/api/features'
import { dataFormat } from '@/utils/util.js'
import Fuse from 'fuse.js'
import { VEmojiPicker } from 'v-emoji-picker'
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'chatRoom',
    components: {
        VEmojiPicker,
    },
    data() {
        return {
            dropContent: false,
            user: {},
            showMiddle: true,
            chatList: [],
            userList: [],
            user_active: null,
            msg_active: {},
            fuse: null,
            keyword: '',
            cloneData: [],
            msgContent: '',
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        },
        address() {
            return this.user.address.join('-')
        },
        department() {
            let sectorJobs = JSON.parse(JSON.stringify(this.user.SectorJobs))
            sectorJobs.pop()
            return sectorJobs.join('-')
        },
    },
    created() {
        this.user = this.userInfo
    },
    methods: {
        formatTime(time) {
            return dataFormat(time, 'yyyy/MM/dd', 1)
        },
        // 获取聊天记录
        async getChatRecord() {
            let _this = this
            await getChatRecord().then((res) => {
                if (res.state) {
                    _this.chatList = res.result
                    _this.userList = res.userList
                    for (let i = 0; i < _this.userList.length; i++) {
                        _this.userList[i].unreadMsg = 0
                        for (let j = 0; j < _this.chatList.length; j++) {
                            if (
                                _this.userList[i].UserID == _this.chatList[j].UserID &&
                                _this.user.UserID == _this.chatList[j].ToUserID
                            ) {
                                _this.userList[i].lastMsg = _this.chatList[j].Content
                                _this.userList[i].createTime = _this.chatList[j].createTime
                                _this.chatList[j].avatar = _this.userList[i].avatar
                                _this.chatList[j].CnName = _this.userList[i].CnName
                            }
                        }
                    }
                    let firstUser = _this.userList.filter((v) => {
                        return v.UserID != _this.user.UserID
                    })
                    _this.user_active = firstUser[0].UserID
                    _this.msg_active = firstUser[0].CnName
                    _this.cloneData = cloneDeep(_this.userList)
                    _this.scrollToBottom()
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        // 解析emoji
        parMsg(val) {
            if (!val) return
            let patt = /&#\d+;/g
            let H, L, code
            let arr = val.match(patt) || []
            for (let i = 0; i < arr.length; i++) {
                code = arr[i]
                code = code.replace('&#', '').replace(';', '')
                // 高位
                H = Math.floor((code - 0x10000) / 0x400) + 0xd800
                // 低位
                L = ((code - 0x10000) % 0x400) + 0xdc00
                code = '&#' + code + ';'
                let s = String.fromCharCode(H, L)
                val = val.replace(code, s)
            }
            return val
        },
        changeUser(UserID, CnName) {
            let _this = this
            _this.msgContent = ''
            _this.user_active = UserID
            _this.msg_active = CnName
            _this.scrollToBottom()
            _this.userList.forEach((v) => {
                if (v.UserID == UserID) v.unreadMsg = 0
            })
        },
        search() {
            let _this = this
            if (!_this.keyword) {
                _this.userList = _this.cloneData
                return
            }
            // 初始化
            let options = {
                shouldSort: true, // 是否按分数对结果列表排序
                includeScore: true, //  是否应将分数包含在结果集中。0分表示完全匹配，1分表示完全不匹配。
                threshold: 0.6, // 匹配算法阈值。阈值为0.0需要完全匹配（字母和位置），阈值为1.0将匹配任何内容。
                /**
                 * 确定匹配与模糊位置（由位置指定）的距离。一个精确的字母匹配，即距离模糊位置很远的字符将被视为完全不匹配。
                 *  距离为0要求匹配位于指定的准确位置，距离为1000则要求完全匹配位于使用阈值0.8找到的位置的800个字符以内。
                 */
                location: 0, // 确定文本中预期找到的模式的大致位置。
                distance: 100,
                maxPatternLength: 32, // 模式的最大长度
                minMatchCharLength: 1, // 模式的最小字符长度
                // 搜索标题与作者名
                keys: [
                    {
                        name: 'CnName',
                        weight: 0.7,
                    },
                ],
            }
            // 设置数据与参数
            _this.fuse = new Fuse(_this.userList, options)
            _this.userList = _this.fuse.search(_this.keyword).map((v) => v.item)
        },
        // 消息置于底部
        scrollToBottom() {
            this.$nextTick(() => {
                var container = this.$refs.msgContent
                container.scrollTop = container.scrollHeight
            })
        },
        // 发送消息
        async sendMsg() {
            let _this = this
            let patt = /[\ud800-\udbff][\udc00-\udfff]/g
            // 检测utf16字符正则
            _this.msgContent = _this.msgContent.replace(patt, function (char) {
                let H, L, code
                if (char.length === 2) {
                    H = char.charCodeAt(0)
                    // 取出高位
                    L = char.charCodeAt(1)
                    // 取出低位
                    code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00
                    // 转换算法
                    return '&#' + code + ';'
                } else {
                    return char
                }
            })
            let params = {
                UserID: _this.user.UserID,
                ToUserID: _this.user_active,
                Content: _this.msgContent,
                createTime: new Date(),
            }
            await saveCharMsg(params).then((res) => {
                _this.msgContent = ''
                _this.chatList.push(params)
                for (let i = 0; i < _this.userList.length; i++) {
                    for (let j = 0; j < _this.chatList.length; j++) {
                        if (_this.userList[i].UserID == _this.chatList[j].UserID) {
                            _this.chatList[j].avatar = _this.userList[i].avatar
                        }
                    }
                }
                _this.scrollToBottom()
                _this.sendMessageToServer(params)
            })
        },
        // 向服务端发送消息
        sendMessageToServer: function (data) {
            setTimeout(() => {
                this.$socket.emit('chat', data)
            }, 1000)
        },
        // 选择表情
        selectEmoji(emoji) {
            let _this = this
            let elInput = document.getElementById('input_box')
            let start = elInput.selectionStart // 记录光标开始的位置
            let end = elInput.selectionEnd // 记录选中的字符 最后的字符的位置
            if (start === undefined || end === undefined) return
            let txt = elInput.value
            // 将表情添加到选中的光标位置
            let result = txt.substring(0, start) + emoji.data + txt.substring(end)
            elInput.value = result // 赋值给input的value
            // 重置光标位置
            elInput.focus()
            elInput.selectionStart = start + emoji.data.length
            elInput.selectionEnd = start + emoji.data.length
            _this.msgContent = result // 赋值(注意这里一定要赋值给表情输入框绑定的那个值)
        },
    },
    // 监听websocket信息
    sockets: {
        chat(data) {
            let _this = this
            if (data && data.ToUserID == _this.user.UserID) {
                _this.userList.forEach((v) => {
                    if (data.UserID == v.UserID && data.ToUserID == _this.user.UserID) v.lastMsg = data.Content
                })
                if (data.ToUserID == _this.user.UserID) _this.chatList.push(data)
                _this.scrollToBottom()
            }
            // 设置发送用户的未读消息
            if (data && data.UserID != _this.user_active) {
                _this.userList.forEach((v) => {
                    if (v.UserID == data.UserID) v.unreadMsg += 1
                })
            }
        },
    },
    watch: {
        // 监听路由参数,深度监听，同时也可监听到param参数变化
        $route: {
            async handler(to, from) {
                let _this = this
                await _this.getChatRecord()
                _this.userList.map((v) => {
                    if (v.UserID == to.params.UserID) {
                        _this.changeUser(v.UserID, v.CnName)
                    }
                })
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.chat-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .wechat {
        width: 860px;
        height: 680px;
        background: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    .sidestrip {
        width: 60px;
        background: #2a2e32;
        float: left;
        height: 100%;
        border-radius: 4px 0 0 4px;
        padding-top: 20px;
        position: relative;
        .am-dropdown {
            position: relative;
            display: inline-block;
            .own_head {
                width: 34px;
                height: 34px;
                margin-left: 13px;
            }
            .am-dropdown-content {
                position: absolute;
                z-index: 8;
                top: 0;
                left: 32px;
                width: 300px;
                margin-left: 20px;
                border-radius: 4px;
                background: #fff;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
                padding: 30px;
                animation-duration: 0.15s;
                min-width: 160px;
                .own_head_top {
                    width: 100%;
                    display: inline-block;
                    border-bottom: 1px solid #f4f4f4;
                    padding-bottom: 25px;
                    .own_head_top_text {
                        float: left;
                        .own_name {
                            font-size: 18px;
                            color: #333;
                            margin-bottom: 6px;
                        }
                        .own_numb {
                            font-size: 14px;
                            color: #999;
                        }
                    }
                }
                .own_head_bottom {
                    padding-top: 20px;
                    p {
                        color: #333;
                        span {
                            color: #999;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
        .sidestrip_icon {
            margin-top: 30px;
            padding: 0 18px;
            width: 60px;
            span {
                width: 100%;
                height: 24px;
                display: block;
                margin-bottom: 30px;
            }
        }
        .sidestrip_bc {
            position: absolute;
            bottom: 20px;
            left: 18px;
        }
    }
    .middle {
        width: 250px;
        height: 100%;
        float: left;
        background: #e6e5e5;
        overflow: hidden;
        .wx_search {
            padding: 25px 12px 12px;
            display: inline-block;
            width: 100%;
            float: inherit;
        }
        .office_text {
            width: 100%;
            height: calc(100% - 62px);
            position: relative;
            display: inline-block;
            overflow: hidden;
            ul {
                margin: 0;
                padding: 0;
                width: 100%;
                position: absolute;
                top: 0;
            }
            .user_list {
                li {
                    width: 100%;
                    height: 64px;
                    padding: 12px;
                    .user_head {
                        background: #999;
                        height: 40px;
                        width: 40px;
                        border-radius: 2px;
                        float: left;
                    }
                    .user_text {
                        float: left;
                        height: 40px;
                        width: 120px;
                        padding-left: 8px;
                        p {
                            line-height: 20px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin-bottom: 0;
                        }
                        .user_name {
                            color: #333;
                            font-size: 14px;
                        }
                        .user_message {
                            color: #999;
                            font-size: 12px;
                        }
                    }
                    .user_time {
                        color: #999;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .talk_window {
        width: 550px;
        height: 100%;
        float: left;
        background: #f5f5f5;
        .windows_top {
            padding-top: 10px;
            height: 62px;
            border-bottom: 1px solid #e7e7e7;
            .windows_top_box {
                width: 100%;
                height: 100%;
                position: relative;
                span {
                    font-size: 18px;
                    color: #333;
                    line-height: 52px;
                    padding-left: 30px;
                    display: inline-block;
                }
            }
        }
        .windows_body {
            height: 473px;
            width: 100%;
            .office_text {
                width: 100%;
                height: 100%;
                position: relative;
                display: inline-block;
                .content {
                    margin: 0;
                    padding: 0;
                    position: absolute;
                    top: 0;
                    width: 100%;
                    padding: 10px 20px;
                    .me {
                        margin-top: 10px;
                        padding-left: 10px;
                        display: block;
                        clear: both;
                        float: right;
                        margin-bottom: 5px;
                        .me_msg {
                            background: #9eea6a;
                            padding: 6px;
                            border-radius: 4px;
                            margin: 0 10px;
                            max-width: 80%;
                            border: 1px solid #9eea6a;
                            position: relative;
                            display: inline-block;
                        }
                        .me_msg:before {
                            content: ' ';
                            position: absolute;
                            top: 9px;
                            border: 6px solid transparent;
                            border-left-color: #9eea6a;
                            left: 100%;
                        }
                    }
                    .other {
                        margin-top: 10px;
                        padding-left: 10px;
                        width: 80%;
                        display: block;
                        clear: both;
                        float: left;
                        margin-bottom: 5px;
                        .other_msg {
                            background: #fff;
                            padding: 6px;
                            border-radius: 4px;
                            float: left;
                            margin: 0 10px;
                            max-width: 80%;
                            border: 1px solid #ededed;
                            position: relative;
                            display: inline-block;
                        }
                        .other_msg:before {
                            content: '';
                            position: absolute;
                            top: 9px;
                            border: 6px solid transparent;
                            border-right-color: #fff;
                            right: 100%;
                        }
                    }
                }
            }
        }
        .windows_input {
            border-top: 1px solid #ececec;
            height: 145px;
            width: 100%;
            background: #fff;
            .input_icon {
                height: 42px;
                padding: 0 28px;
                span {
                    position: relative;
                    display: inline-block;
                    height: 20px;
                    width: 24px;
                    margin-top: 11px;
                    margin-right: 8px;
                }
            }
            .input_box {
                height: calc(100% - 42px);
                textarea {
                    width: calc(100% - 56px);
                    height: calc(100% - 42px);
                    border: none;
                    outline: 0;
                    background: #fff;
                    resize: none;
                    margin-left: 28px;
                    font-size: 14px;
                    line-height: 20px;
                }
                #send {
                    border: 1px solid #e5e5e5;
                    background: #f5f5f5;
                    color: #666;
                    padding: 0 8px;
                    outline: 0;
                    height: 26px;
                    float: right;
                    margin-top: 8px;
                    margin-right: 28px;
                }
            }
        }
    }
}
.user-avatar {
    background: @primary-color;
}
</style>