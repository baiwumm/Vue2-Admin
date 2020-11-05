
<template>
    <div id="app">
        <div id="nav">
            <button @click="connect">连接socket</button>
            <button @click="sendMessage">发送数据</button>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {}
    },

    methods: {
        // 连接socket
        connect() {
            this.$socket.open() // 开始连接socket

            // 订阅事件
            this.sockets.subscribe('welcome', (data) => {
                console.log('welcome data ', data)
            })
        },

        // 发送消息
        sendMessage() {
            this.$socket.emit('announcement', '这里是客户端')
        },
    },

    sockets: {
        //
        welcome: (data) => {
            console.log('welcome data ', data)
        },
    },
}
</script>
