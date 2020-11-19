<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="作者">
                            <a-input placeholder="请输入" v-model="author" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="标题">
                            <a-input placeholder="请输入" v-model="title" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="创建时间">
                            <a-range-picker @change="dealTime" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <span class="table-page-search-submitButtons">
                            <a-space>
                                <a-button type="primary" @click="query">查询</a-button>
                                <a-button type="primary" @click="release">发布公告</a-button>
                            </a-space>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <!-- 表格数据 -->
        <a-table
            :columns="columns"
            rowKey="AnnouncementID"
            :data-source="data"
            :pagination="pagination"
            @change="tableChange"
            :loading="loading"
        >
            <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                <a-descriptions title="公告详情" :column="{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="作者">
                        <template>
                            <a-tag color="purple">
                                {{ record.author }}
                            </a-tag>
                        </template>
                    </a-descriptions-item>
                    <a-descriptions-item label="中文名">
                        {{ record.CnName }}
                    </a-descriptions-item>
                    <a-descriptions-item label="创建时间">
                        {{ record.createTime }}
                    </a-descriptions-item>
                    <a-descriptions-item label="标题">
                        <template>
                            <a-tag color="blue">
                                {{ record.title }}
                            </a-tag>
                        </template>
                    </a-descriptions-item>
                    <a-descriptions-item label="内容">
                        {{ record.content.length > 180 ? record.content.substr(0, 180) + '...' : record.content }}
                    </a-descriptions-item>
                </a-descriptions>
            </div>
            <span slot="action" slot-scope="text, record">
                <a @click="onDelete(record)">删除</a>
            </span>
        </a-table>
        <!-- 抽屉-发布公告 -->
        <a-drawer :title="announcementTitle" :width="600" :visible="visible" @close="onClose" :maskClosable="false">
            <a-form ref="formLogin" :form="form" @submit="handleSubmit">
                <a-row :gutter="16">
                    <a-col :span="24">
                        <a-form-item label="标题">
                            <a-input v-decorator="rules.title" placeholder="请输入标题" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="内容">
                            <a-textarea
                                v-decorator="rules.content"
                                placeholder="请输入内容"
                                :auto-size="{ minRows: 3, maxRows: 5 }"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <div
                    :style="{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                        zIndex: 1,
                    }"
                >
                    <a-button type="primary" htmlType="submit" :loading="loginState" :disabled="loginState">
                        提交
                    </a-button>
                </div>
            </a-form>
        </a-drawer>
    </a-card>
</template>

<script>
import { Announcement, addAnnouncement, deleteAnnouncement, webSockets } from '@/api/system'
import { dataFormat } from '@/utils/util.js'
export default {
    data() {
        return {
            columns: [
                { title: '作者', dataIndex: 'author', key: 'author', ellipsis: true },
                { title: '中文名', dataIndex: 'CnName', key: 'CnName', ellipsis: true },
                { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
                { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
                {
                    title: '操作',
                    width: '80px',
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data: [],
            author: '',
            title: '',
            createTime: [],
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 20,
                showTotal: (total) => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            announcementTitle: '',
            visible: false,
            form: this.$form.createForm(this),
            rules: {
                title: ['title', { initialValue: '', rules: [{ required: true, message: '请输入标题' }] }],
                content: ['content', { initialValue: '', rules: [{ required: true, message: '请输入内容' }] }],
            },
            loginState: false,
            AnnouncementID: '',
            user: {},
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        },
    },
    created() {
        this.user = this.userInfo
        this.sendMessageToServer()
    },
    methods: {
        dealTime(date, dateString) {
            this.createTime = dateString
        },
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getAnnouncementList()
        },
        async getAnnouncementList() {
            let _this = this
            _this.loading = true
            let params = {
                author: _this.author,
                title: _this.title,
                createTime: JSON.stringify(_this.createTime),
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await Announcement(params).then((res) => {
                if (res.state == 1) {
                    _this.data = res.result.list
                    _this.data.forEach((v) => {
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd hh:mm:ss')
                    })
                    _this.pagination.total = res.result.total
                    _this.loading = false
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        query() {
            this.pagination.defaultCurrent = 1
            this.getAnnouncementList()
        },
        onClose() {
            let _this = this
            _this.visible = false
        },
        release() {
            let _this = this
            _this.visible = true
            _this.announcementTitle = '发布公告'
        },
        // 提交按钮
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.loginState = true
            const validateFieldsKey = ['title', 'content']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addAnnouncement(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        let keys = Object.keys(_this.rules)
                                        keys.map((v) => {
                                            _this.rules[v][1].initialValue = ''
                                        })
                                        _this.visible = false
                                        _this.$message.success(res.msg)
                                        _this.getAnnouncementList()
                                        _this.sendMessageToServer(params)
                                    } else if (res.state == 2) {
                                        _this.$message.warn(res.msg)
                                    } else {
                                        _this.$message.error(res.msg)
                                    }
                                })
                                .finally(() => {
                                    setTimeout(() => {
                                        _this.loginState = false
                                    }, 600)
                                })
                        },
                        onCancel() {
                            _this.loginState = false
                        },
                    })
                } else {
                    setTimeout(() => {
                        _this.loginState = false
                    }, 600)
                }
            })
        },
        // 删除数据
        onDelete(record) {
            let _this = this
            let params = {
                AnnouncementID: record.AnnouncementID,
                title: record.title,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认提交吗?',
                onOk: async () => {
                    await deleteAnnouncement(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getAnnouncementList()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
        // 向服务端发送消息
        sendMessageToServer: function (data) {
            this.$socket.emit('announcement', data)
            // if (data) {
            //     this.announcementDetail()
            // }
        },
        announcementDetail() {
            webSockets().then((res) => {
                if (res.state == 1) {
                    // 接收到信息
                    // 延迟 1 秒显示欢迎信息
                    setTimeout(() => {
                        this.$notification.success({
                            message: this.user.CnName + '发布了公告',
                            description: '哈哈',
                        })
                    }, 1000)
                }
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getAnnouncementList()
        })
    },
    destroyed() {
        this.$socket.disconnect()
    },
}
</script>

<style>
</style>