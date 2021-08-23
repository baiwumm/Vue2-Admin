<template>
    <page-header-wrapper content="系统用户信息，和角色组形成一对多的关系">
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="用户名">
                                <a-input placeholder="请输入用户名" v-model="queryForm.username" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="中文名">
                                <a-input placeholder="请输入中文名" v-model="queryForm.CnName" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="状态">
                                <a-select placeholder="请选择状态" v-model="queryForm.Status" allowClear>
                                    <a-select-option value="1">启用</a-select-option>
                                    <a-select-option value="0">禁用</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-button type="primary" @click="query" v-action:query>查询</a-button>
                                <a-button type="primary" style="margin-left: 8px" @click="addUser" v-action:add
                                    >添加</a-button
                                >
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <!-- 表格数据 -->
            <a-table
                :columns="columns"
                rowKey="UserID"
                :data-source="data"
                :pagination="pagination"
                @change="tableChange"
                :loading="loading"
            >
                <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <a-descriptions title="用户信息" :column="{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                        <a-descriptions-item label="用户名">
                            {{ record.username }}
                        </a-descriptions-item>
                        <a-descriptions-item label="中文名">
                            {{ record.CnName }}
                        </a-descriptions-item>
                        <a-descriptions-item label="电子邮箱">
                            {{ record.Email }}
                        </a-descriptions-item>
                        <a-descriptions-item label="电话">
                            {{ record.Phone }}
                        </a-descriptions-item>
                        <a-descriptions-item label="状态">
                            <a-tag :color="record.Status ? 'blue' : 'red'">
                                {{ record.Status ? '启用' : '禁用' }}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="性别">
                            <a-tag :color="record.SEX ? 'purple' : 'cyan'">
                                {{ record.SEX ? '男' : '女' }}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="工作部门">
                            {{ record.department.join('-') }}
                        </a-descriptions-item>
                        <a-descriptions-item label="工作岗位">
                            {{ record.SectorJobs.join('-') }}
                        </a-descriptions-item>
                        <a-descriptions-item label="工作地址">
                            {{ record.address.join('') }}
                        </a-descriptions-item>
                        <a-descriptions-item label="标签">
                            <template v-if="record.label && record.label.length">
                                <a-tag
                                    style="margin-top: 5px"
                                    v-for="(tag, index) in record.label.slice(0, 6)"
                                    :key="index"
                                    :color="tag.length > 4 ? 'cyan' : tag.length > 2 ? 'blue' : 'purple'"
                                    >{{ tag }}</a-tag
                                >......
                            </template>
                        </a-descriptions-item>
                        <a-descriptions-item label="座右铭">
                            {{ record.motto }}
                        </a-descriptions-item>
                        <a-descriptions-item label="头像">
                            <a-avatar :src="record.avatar" size="large" />
                        </a-descriptions-item>
                    </a-descriptions>
                </div>
                <span slot="SEX" slot-scope="text, record">
                    {{ record.SEX ? '男' : '女' }}
                </span>
                <span slot="Status" slot-scope="text, record">
                    <a-tag :color="record.Status ? 'blue' : 'red'">
                        {{ record.Status ? '启用' : '禁用' }}
                    </a-tag>
                </span>
                <span slot="roleList" slot-scope="text, record">
                    <template>
                        <a-tag color="purple" v-for="(item, index) in record.roleList" :key="index">
                            {{ item }}
                        </a-tag>
                    </template>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button
                        type="primary"
                        v-action:edit
                        v-if="record.username == 'admin'"
                        @click="onEdit(record)"
                        size="small"
                    >
                        编辑
                    </a-button>
                    <a @click="onEdit(record)" v-action:edit v-else>编辑</a>
                    <a-divider type="vertical" v-if="record.username != 'admin'" />
                    <a @click="onDelete(record)" v-action:delete v-if="record.username != 'admin'">删除</a>
                </span>
            </a-table>
            <!-- 抽屉-添加编辑 -->
            <a-drawer :title="title" :width="600" :visible="visible" @close="onClose" :maskClosable="false">
                <a-form ref="formLogin" :form="form" @submit="handleSubmit">
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="角色权限">
                                <a-select
                                    allowClear
                                    v-decorator="rules.roleList"
                                    mode="multiple"
                                    style="width: 100%"
                                    placeholder="请选择角色权限"
                                >
                                    <a-select-option v-for="item in roleList" :key="item.roleName">
                                        {{ item.roleName }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="用户名">
                                <a-input
                                    allowClear
                                    v-decorator="rules.username"
                                    placeholder="请输入用户名"
                                    :disabled="rules['username'][1].initialValue == 'admin'"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="中文名">
                                <a-input v-decorator="rules.CnName" placeholder="请输入中文名" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="工作部门">
                                <a-cascader
                                    change-on-select
                                    placeholder="请选择工作部门"
                                    v-decorator="rules.department"
                                    :options="SectorDepartments"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="性别">
                                <a-radio-group v-decorator="rules.SEX">
                                    <a-radio :value="Number(v.value)" v-for="(v, i) in userSex" :key="i">
                                        {{ v.text }}
                                    </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="状态">
                                <a-radio-group v-decorator="rules.Status">
                                    <a-radio :value="1"> 启用 </a-radio>
                                    <a-radio :value="0"> 禁用 </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="工作岗位">
                                <a-cascader
                                    change-on-select
                                    placeholder="请选择部门岗位"
                                    v-decorator="rules.SectorJobs"
                                    :options="SectorJobs"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="工作地址">
                                <a-cascader
                                    placeholder="请选择工作地址"
                                    v-decorator="rules.address"
                                    :options="cityJson"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="密码">
                                <a-input-password v-decorator="rules.password" placeholder="请输入密码" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="确认密码">
                                <a-input-password
                                    v-decorator="rules.confirmPassword"
                                    placeholder="请确认密码"
                                    allowClear
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
    </page-header-wrapper>
</template>

<script>
import CryptoJS from 'crypto-js'
import { User, updateUserList, deleteUser } from '@/api/system'
import { crypto_key, crypto_iv, dataFormat, treeData } from '@/utils/util.js'
import { getOrganizationList } from '@/api/integrated'
import cities from '@/core/cities.json'
import { DictionaryCD } from '@/api/public'
import cloneDeep from 'lodash/cloneDeep'
import pick from 'lodash/pick'
export default {
    name: 'user',
    data() {
        return {
            queryForm: {},
            columns: [
                { title: '用户名', dataIndex: 'username', key: 'username', ellipsis: true },
                { title: '中文名', dataIndex: 'CnName', key: 'CnName', ellipsis: true },
                {
                    title: '性别',
                    dataIndex: 'SEX',
                    key: 'SEX',
                    ellipsis: true,
                    scopedSlots: { customRender: 'SEX' },
                },
                {
                    title: '状态',
                    dataIndex: 'Status',
                    key: 'Status',
                    ellipsis: true,
                    scopedSlots: { customRender: 'Status' },
                },
                {
                    title: '角色权限',
                    dataIndex: 'roleList',
                    key: 'roleList',
                    ellipsis: true,
                    scopedSlots: { customRender: 'roleList' },
                },
                { title: '创建时间', dataIndex: 'CreateTime', key: 'CreateTime', ellipsis: true },
                {
                    title: '操作',
                    width: '120px',
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data: [],
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 20,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            title: '',
            visible: false,
            form: this.$form.createForm(this),
            loginState: false,
            rules: {
                username: ['username', { rules: [{ required: true, message: '请输入用户名' }] }],
                CnName: ['CnName', { rules: [{ required: true, message: '请输入中文名' }] }],
                SEX: ['SEX', { initialValue: 1, rules: [{ required: true, message: '请选择性别' }] }],
                Status: ['Status', { initialValue: 1, rules: [{ required: true, message: '请选择性别' }] }],
                department: ['department', { rules: [{ required: true, message: '请选择工作部门' }] }],
                SectorJobs: ['SectorJobs', { rules: [{ required: true, message: '请选择工作岗位' }] }],
                address: ['address', { rules: [{ required: true, message: '请选择工作地址' }] }],
                roleList: ['roleList', { rules: [{ required: true, message: '请选择角色权限' }] }],
                password: ['password', { rules: [{ required: true, message: '请输入密码' }] }],
                confirmPassword: ['confirmPassword', { rules: [{ required: true, message: '请确认密码' }] }],
            },
            cityJson: cities.options,
            ID: '',
            roleList: [],
            SectorJobs: [],
            SectorDepartments: [],
            userSex: [],
        }
    },
    methods: {
        async getOrganizationList() {
            let _this = this
            let params = {
                departmentName: '',
                createTime: JSON.stringify([]),
                current: 1,
                pageSize: 1,
            }
            await getOrganizationList(params).then((res) => {
                if (res.state == 1) {
                    res.parentList.forEach((v) => {
                        ;(v.value = v.name), (v.label = v.name)
                    })
                    _this.SectorDepartments = treeData(
                        res.parentList.filter((v) => v.category == 1),
                        'OrganizationID',
                        'parentId',
                        'children'
                    )
                    _this.SectorJobs = treeData(
                        res.parentList.filter((v) => v.category == 2),
                        'OrganizationID',
                        'parentId',
                        'children'
                    )
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getUserList()
        },
        // 获取用户列表
        async getUserList() {
            let _this = this
            _this.loading = true
            let params = {
                username: _this.queryForm.username,
                CnName: _this.queryForm.CnName,
                Status: _this.queryForm.Status,
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await User(params).then((res) => {
                if (res.state == 1) {
                    res.result.list.forEach((v) => {
                        v.CreateTime = dataFormat(v.CreateTime, 'yyyy-MM-dd hh:mm:ss')
                        v.department = JSON.parse(v.department)
                        v.SectorJobs = JSON.parse(v.SectorJobs)
                        v.address = JSON.parse(v.address)
                        v.label = JSON.parse(v.label)
                        v.roleList = JSON.parse(v.roleList)
                    })
                    _this.data = res.result.list
                    _this.pagination.total = res.result.total
                    _this.roleList = res.roleList
                    _this.loading = false
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        query() {
            this.pagination.defaultCurrent = 1
            this.getUserList()
        },
        // 提交保存
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.loginState = true
            const validateFieldsKey = [
                'roleList',
                'username',
                'CnName',
                'SEX',
                'Status',
                'department',
                'SectorJobs',
                'address',
                'roleList',
                'password',
                'confirmPassword',
            ]
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    if (params.password != params.confirmPassword) {
                        _this.$message.warn('密码不匹配,请确认!')
                        setTimeout(() => {
                            _this.loginState = false
                        }, 600)
                        return
                    }
                    if (params.password.length < 6 || params.confirmPassword.length < 6) {
                        _this.$message.warn('密码长度不能小于6位!')
                        setTimeout(() => {
                            _this.loginState = false
                        }, 600)
                        return
                    }
                    /*
                     * 对密码进行加密，传输给后台进行验证
                     * @param {String}   word  需要加密的密码
                     * @param {String}   keyStr  对密码加密的秘钥
                     * @return {String}   加密的密文
                     * */
                    params.password = CryptoJS.AES.encrypt(params.password, crypto_key, {
                        iv: crypto_iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7,
                    }).toString()
                    params.ID = _this.ID
                    delete params.confirmPassword
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await updateUserList(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        let keys = Object.keys(_this.rules)
                                        _this.ID = ''
                                        _this.visible = false
                                        _this.$message.success(res.msg)
                                        _this.getUserList()
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
        // 编辑操作
        onEdit(record) {
            let _this = this,
                cloneData = cloneDeep(record)
            _this.visible = true
            _this.title = '编辑用户:' + cloneData.username
            _this.ID = cloneData.UserID
            //拿到加密后的密码并解密
            let decrypted = CryptoJS.AES.decrypt(cloneData.password, crypto_key, {
                iv: crypto_iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            })
            let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
            cloneData.password = decryptedStr.toString()
            cloneData.confirmPassword = decryptedStr.toString()
            _this.$nextTick(() => {
                _this.form.setFieldsValue(
                    pick(cloneData, [
                        'username',
                        'CnName',
                        'SEX',
                        'Status',
                        'department',
                        'SectorJobs',
                        'address',
                        'roleList',
                        'password',
                        'confirmPassword',
                    ])
                )
            })
        },
        // 删除操作
        onDelete(record) {
            let _this = this
            let params = {
                ID: record.UserID,
                username: record.username,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认提交吗?',
                onOk: async () => {
                    await deleteUser(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getUserList()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
        onClose() {
            let _this = this
            _this.visible = false
            _this.form.resetFields()
            _this.ID = ''
        },
        addUser() {
            let _this = this
            _this.title = '添加用户'
            _this.visible = true
            _this.ID = ''
        },
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.userSex = res.result.sys_user_sex
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getDictionaryCD()
            this.getUserList()
            this.getOrganizationList()
        })
    },
}
</script>

<style lang="less" scoped>
</style>
