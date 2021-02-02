<template>
    <page-header-wrapper
        content="该模块主要是为了实现websocket的推送和小铃铛的功能，并可在其基础上拓展，websocket在即时通讯、通知与消息推送，实时分析等场景中有较为广泛的应用。"
    >
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
                                <a-range-picker v-model="createTime" valueFormat="YYYY-MM-DD" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-space>
                                    <a-button type="primary" @click="query" v-action:query>查询</a-button>
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
                <span slot="articleTitle" slot-scope="text, record">
                    <a-tooltip :title="text">
                        <a @click="showDetails(record)">{{ text }}</a>
                    </a-tooltip>
                </span>
                <span slot="status" slot-scope="text, record">
                    <a-popconfirm ok-text="是" cancel-text="否" @confirm="confirmHandleStatus(record)">
                        <span slot="title">确认{{ record.status === '1' ? '开启' : '关闭' }}吗?</span>
                        <a-switch
                            checked-children="开启"
                            un-checked-children="关闭"
                            :checked="record.status == 0"
                            :loading="switchLoading"
                        />
                    </a-popconfirm>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-dropdown>
                        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> 更多<a-icon type="down" /> </a>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="onEdit(record)" v-action:edit>
                                <a-icon type="edit" />编辑</a-menu-item
                            >
                            <a-menu-item key="2" @click="onDelete(record)" v-action:delete>
                                <a-icon type="delete" />删除</a-menu-item
                            >
                            <a-menu-item key="3" @click="showDetails(record)">
                                <a-icon type="container" />详情</a-menu-item
                            >
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
            <!-- 抽屉-发布公告 -->
            <a-modal :title="announcementTitle" :width="1000" v-model="visible" @cancel="onClose" :maskClosable="false">
                <a-form :form="form">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-row :gutter="16" type="flex">
                                <a-col flex="auto">
                                    <a-form-item label="标题">
                                        <a-input v-decorator="rules.title" placeholder="请输入标题" allowClear />
                                    </a-form-item>
                                </a-col>
                                <a-col flex="140px">
                                    <a-form-item label="类型">
                                        <a-radio-group button-style="solid" v-decorator="rules.type">
                                            <a-radio-button
                                                :value="Number(v.value)"
                                                v-for="(v, i) in typeList"
                                                :key="i"
                                            >
                                                {{ v.text }}
                                            </a-radio-button>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                                <a-col flex="160px">
                                    <a-form-item label="状态">
                                        <a-radio-group v-decorator="rules.status">
                                            <a-radio :value="0"> 开启 </a-radio>
                                            <a-radio :value="1"> 关闭 </a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="内容">
                                <quill-editor v-model="editContent" ref="myQuillEditor" :options="editorOption">
                                </quill-editor>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
                <template slot="footer">
                    <a-button type="primary" :loading="loginState" :disabled="loginState" @click="handleSubmit">
                        发布
                    </a-button>
                </template>
            </a-modal>
        </a-card>
    </page-header-wrapper>
</template>

<script>
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Announcement, addAnnouncement, deleteAnnouncement, saveAnnouncementRead } from '@/api/system'
import { dataFormat } from '@/utils/util.js'
import bus from '@/utils/bus'
import { DictionaryCD } from '@/api/public'
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'announcement',
    components: {
        quillEditor,
    },
    data() {
        return {
            columns: [
                { title: '作者', dataIndex: 'username', key: 'username', ellipsis: true },
                { title: '中文名', dataIndex: 'CnName', key: 'CnName', ellipsis: true },
                {
                    title: '标题',
                    dataIndex: 'title',
                    key: 'title',
                    ellipsis: true,
                    scopedSlots: { customRender: 'articleTitle' },
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    ellipsis: true,
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    ellipsis: true,
                    customRender: (text, row, index) => {
                        let result = '',
                            color = ''
                        this.typeList.map((v) => {
                            if (text == v.value) {
                                result = v.text
                            }
                            switch (text) {
                                case 1:
                                    color = 'cyan'
                                    break
                                case 2:
                                    color = 'purple'
                                    break
                            }
                        })
                        return <a-tag color={color}>{result}</a-tag>
                    },
                },
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
                {
                    title: '操作',
                    width: '110px',
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
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            announcementTitle: '',
            visible: false,
            form: this.$form.createForm(this),
            rules: {
                title: ['title', { rules: [{ required: true, message: '请输入标题' }] }],
                type: ['type', { initialValue: 1, rules: [{ required: true, message: '请选择类型' }] }],
                status: ['status', { initialValue: 0, rules: [{ required: true, message: '请选择状态' }] }],
            },
            loginState: false,
            AnnouncementID: '',
            user: {},
            editorOption: {
                // 编辑器配置
                placeholder: '请在这里输入',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                        ['blockquote', 'code-block'], //引用，代码块
                        [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                        [{ list: 'ordered' }, { list: 'bullet' }], //列表
                        [{ script: 'sub' }, { script: 'super' }], // 上下标
                        [{ indent: '-1' }, { indent: '+1' }], // 缩进
                        [{ direction: 'rtl' }], // 文本方向
                        [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
                        [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
                        [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                        [{ font: [] }], //字体
                        [{ align: [] }], //对齐方式
                        ['clean'], //清除字体样式
                        // ['image', 'video'], //上传图片、上传视频
                    ],
                },
            },
            editContent: '', // 编辑器内容
            typeList: [],
            switchLoading: false,
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
        // 转码
        escapeStringHTML(content) {
            content = content.replace(/&lt;/g, '<')
            content = content.replace(/&gt;/g, '>')
            return content
        },
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getAnnouncementList()
        },
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.typeList = res.result.sys_announcement_type
            })
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
            const validateFieldsKey = ['title', 'type', 'status']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.content = this.editContent
                    params.AnnouncementID = _this.AnnouncementID
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addAnnouncement(params)
                                .then(async (res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        _this.AnnouncementID = ''
                                        _this.editContent = ''
                                        _this.visible = false
                                        _this.$message.success(res.msg)
                                        await _this.getAnnouncementList()
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
        onClose() {
            let _this = this
            _this.visible = false
            _this.form.resetFields()
            _this.editContent = ''
            _this.AnnouncementID = ''
        },
        // 编辑表格数据
        onEdit(record) {
            let _this = this,
                cloneData = cloneDeep(record)
            _this.visible = true
            _this.announcementTitle = '编辑公告:' + cloneData.title
            _this.AnnouncementID = cloneData.AnnouncementID
            _this.editContent = cloneData.content
            _this.$nextTick(() => {
                _this.form.setFieldsValue({
                    ['title']: cloneData.title,
                    ['type']: cloneData.type,
                    ['status']: cloneData.status,
                })
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
        // 改变状态
        async confirmHandleStatus(record) {
            let _this = this
            _this.switchLoading = true
            record.status = record.status ? 0 : 1
            delete record.username
            delete record.CnName
            await addAnnouncement(record)
                .then(async (res) => {
                    if (res.state == 1) {
                        _this.$message.success(res.msg)
                        _this.switchLoading = false
                        await _this.getAnnouncementList()
                        bus.$emit('showArticle')
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
        // 公告详情
        async showDetails(data) {
            let _this = this
            // 如果点击未读信息，则请求将用户ID添加到已读字段
            let readList = JSON.parse(data.already) || []
            if (!readList.includes(_this.user.UserID)) {
                let params = { AnnouncementID: data.AnnouncementID, title: data.title }
                await saveAnnouncementRead(params)
            }
            // 事件名字自定义，用不同的名字区别事件
            bus.$emit('showArticle', data)
        },
        // 向服务端发送消息
        sendMessageToServer: function (data) {
            setTimeout(() => {
                this.$socket.emit('announcement', data)
            }, 1000)
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getDictionaryCD()
            this.getAnnouncementList()
        })
    },
    destroyed() {
        this.$socket.disconnect()
    },
}
</script>

<style lang="less" scoped>
.quill-editor /deep/ .ql-container {
    min-height: 300px;
}
</style>