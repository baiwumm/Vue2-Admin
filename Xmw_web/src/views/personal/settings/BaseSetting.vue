<template>
    <div class="account-settings-info-view">
        <a-card :bordered="false" title="基本设置">
            <a-row :gutter="16">
                <a-col :md="24" :lg="16">
                    <a-form layout="vertical" :form="form" @submit="handleSubmit">
                        <a-form-item label="中文名称">
                            <a-input
                                placeholder="给自己起个名字吧"
                                v-decorator="[
                                    'CnName',
                                    {
                                        initialValue: user.CnName,
                                        rules: [{ required: true, message: '给自己起个名字吧' }],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            />
                        </a-form-item>
                        <a-form-item label="手机号码">
                            <a-input
                                placeholder="写上自己的电话吧"
                                v-decorator="[
                                    'Phone',
                                    {
                                        initialValue: user.Phone,
                                        rules: [
                                            { required: true, message: '写上自己的电话吧!' },
                                            { validator: phoneCheck.bind(this) },
                                        ],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            />
                        </a-form-item>
                        <a-form-item label="电子邮箱">
                            <a-input
                                placeholder="写上自己的电子邮箱吧"
                                v-decorator="[
                                    'Email',
                                    {
                                        initialValue: user.Email,
                                        rules: [
                                            {
                                                type: 'email',
                                                message: '电子邮箱格式不对!',
                                            },
                                            { required: true, message: '写上自己的电子邮箱吧' },
                                        ],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            />
                        </a-form-item>
                        <a-form-item label="性别">
                            <a-radio-group v-decorator="['SEX', { initialValue: user.SEX }]">
                                <a-radio :value="Number(v.value)" v-for="(v, i) in userSex" :key="i">
                                    {{ v.text }}
                                </a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="工作部门">
                            <a-cascader
                                change-on-select
                                placeholder="选择自己的工作部门哟!"
                                v-decorator="[
                                    'department',
                                    {
                                        initialValue: user.department,
                                        rules: [{ type: 'array', required: true, message: '选择自己的部门岗位哟!' }],
                                    },
                                ]"
                                :options="SectorDepartments"
                            />
                        </a-form-item>
                        <a-form-item label="工作岗位">
                            <a-cascader
                                change-on-select
                                placeholder="选择自己的部门岗位哟!"
                                v-decorator="[
                                    'SectorJobs',
                                    {
                                        initialValue: user.SectorJobs,
                                        rules: [{ type: 'array', required: true, message: '选择自己的部门岗位哟!' }],
                                    },
                                ]"
                                :options="SectorJobs"
                            />
                        </a-form-item>
                        <a-form-item label="工作地址">
                            <a-cascader
                                placeholder="选择自己的工作地址哟!"
                                v-decorator="[
                                    'address',
                                    {
                                        initialValue: user.address,
                                        rules: [{ type: 'array', required: true, message: '选择自己的工作地址哟!' }],
                                    },
                                ]"
                                :options="cityJson"
                            />
                        </a-form-item>
                        <a-form-item label="座右铭">
                            <a-textarea
                                :auto-Size="{ minRows: 2, maxRows: 6 }"
                                placeholder="写上自己的座右铭吧"
                                v-decorator="[
                                    'motto',
                                    {
                                        initialValue: user.motto,
                                        rules: [{ required: true, message: '写上自己的座右铭吧!' }],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                htmlType="submit"
                                :loading="loginState"
                                :disabled="loginState"
                                v-action:edit
                                >提交</a-button
                            >
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
                    <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
                        <a-icon type="cloud-upload-o" class="upload-icon" />
                        <div class="mask">
                            <a-icon type="plus" />
                        </div>
                        <a-avatar :size="180" :src="option.img" v-if="option.img" />
                        <a-avatar :size="180" :src="option.img" v-else class="user-avatar">{{
                            user.CnName.substr(user.CnName.length - 2, 2)
                        }}</a-avatar>
                    </div>
                </a-col>
            </a-row>
            <avatar-modal ref="modal" @ok="setavatar" />
        </a-card>
    </div>
</template>

<script>
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'
import AvatarModal from './AvatarModal'
import { updateUserInfo } from '@/api/login'
import cities from '@/core/cities.json'
import { getOrganizationList } from '@/api/integrated'
import { treeData } from '@/utils/util.js'
import { DictionaryCD } from '@/api/public'
export default {
    name: 'BaseSetting',
    components: {
        AvatarModal,
    },
    data() {
        return {
            // cropper
            form: this.$form.createForm(this),
            loginState: false,
            preview: {},
            option: {
                img: '',
                info: true,
                size: 1,
                outputType: 'jpeg',
                canScale: false,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 180,
                autoCropHeight: 180,
                fixedBox: true,
                // 开启宽度和高度比例
                fixed: true,
                fixedNumber: [1, 1],
            },
            user: {},
            SectorJobs: [],
            SectorDepartments: [],
            cityJson: cities.options,
            userSex: [],
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        },
    },
    created() {
        this.user = this.userInfo
        this.option.img = this.user.avatar
    },
    methods: {
        async getDepartmentList() {
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
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.loginState = true
            const validateFieldsKey = [
                'CnName',
                'Phone',
                'Email',
                'SEX',
                'department',
                'SectorJobs',
                'address',
                'motto',
            ]
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const userParams = { ...values }
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await updateUserInfo(userParams)
                                .then((res) => {
                                    if (res.state == 1) {
                                        let storeUser = Object.assign(this.user, userParams)
                                        _this.$message.success(res.msg)
                                        storage.set(USER_INFO, storeUser)
                                    } else {
                                        _this.$message.error(res.msg)
                                    }
                                })
                                .catch((err) => {
                                    _this.$message.error(err.msg)
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
        // 验证表单电话格式
        phoneCheck(rule, value, callbackFn) {
            const reg = /^[1][0-9]{10}$/
            if (!reg.test(value)) {
                callbackFn('请输入正确的手机号码!')
                return
            }
            callbackFn()
        },
        setavatar(url) {
            this.option.img = url
        },
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.userSex = res.result.sys_user_sex
            })
        },
    },
    mounted() {
        this.getDictionaryCD()
        this.getDepartmentList()
    },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.avatar-upload-wrapper {
    height: 200px;
    width: 100%;
}

.ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 1.4rem;
        padding: 0.5rem;
        background: rgba(222, 221, 221, 0.7);
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
        opacity: 0;
        position: absolute;
        z-index: 2;
        background: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        transition: opacity 0.4s;

        &:hover {
            opacity: 1;
        }

        i {
            font-size: 2rem;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -1rem;
            margin-top: -1rem;
            color: #d6d6d6;
        }
    }

    img,
    .mask {
        width: 100%;
        max-width: 180px;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
    }
}
.ant-avatar {
    position: initial;
}
.user-avatar {
    background: @primary-color;
    font-size: 42px !important;
}
</style>
