<template>
    <page-header-wrapper
        content="高级表单常见于一次性输入和提交大批量数据的场景，该模块支持表单规则验证、表格数据渲染、表格行编辑等"
    >
        <a-card class="card" title="车辆基本信息" :bordered="false">
            <vehicle-basic-form ref="vehicleBasicInfo" :showSubmit="false" />
        </a-card>
        <a-card class="card" title="车辆其他信息" :bordered="false">
            <vehicle-other-form ref="vehicleOtherInfo" :showSubmit="false" />
        </a-card>
        <!-- 数据表格 -->
        <vehicle-table ref="vehicleTable"></vehicle-table>
        <!-- fixed footer toolbar -->
        <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
            <template slot="extra">
                <a-button @click="resetForm">重置</a-button>
            </template>
            <span class="popover-wrapper">
                <a-popover
                    title="表单校验信息"
                    overlayClassName="antd-pro-pages-forms-style-errorPopover"
                    trigger="click"
                    :getPopupContainer="(trigger) => trigger.parentNode"
                >
                    <template slot="content">
                        <li
                            v-for="item in errors"
                            :key="item.key"
                            @click="scrollToField(item.key)"
                            class="antd-pro-pages-forms-style-errorListItem"
                        >
                            <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
                            <div class="">{{ item.message }}</div>
                            <div class="antd-pro-pages-forms-style-errorField">
                                <a-tag color="purple">
                                    {{ item.fieldLabel }}
                                </a-tag>
                            </div>
                        </li>
                    </template>
                    <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
                        <a-icon type="exclamation-circle" />{{ errors.length }}
                    </span>
                </a-popover>
            </span>
            <a-button type="primary" @click="validate" :loading="loading" v-action:add>提交</a-button>
        </footer-tool-bar>
    </page-header-wrapper>
</template>

<script>
import vehicleBasicForm from './components/vehicleBasicForm'
import vehicleOtherForm from './components/vehicleOtherForm'
import vehicleTable from './components/vehicleTable'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'
import { addEditVehicleInfo } from '@/api/integrated'
export default {
    name: 'advancedForm',
    mixins: [baseMixin],
    components: {
        FooterToolBar,
        vehicleBasicForm,
        vehicleOtherForm,
        vehicleTable,
    },
    data() {
        return {
            loading: false,
            errors: [],
            fieldLabels: {
                VLPN: '车牌号码',
                VLPNColor: '车牌颜色',
                vehicleType: '车辆类型',
                emissionstandard: '排放标准',
                seating: '座位数',
                FuleType: '燃油类型',
                owner: '车主',
                registrationTime: '登记时间',
                brand: '品牌',
                address: '地址',
            },
        }
    },
    methods: {
        // 最终全页面提交
        validate() {
            const {
                $refs: { vehicleBasicInfo, vehicleOtherInfo, vehicleTable },
            } = this
            this.loading = true
            const vehicleBasicForm = new Promise((resolve, reject) => {
                vehicleBasicInfo.form.validateFields((err, values) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(values)
                })
            })
            const vehicleOtherForm = new Promise((resolve, reject) => {
                vehicleOtherInfo.form.validateFields((err, values) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(values)
                })
            })
            // clean this.errors
            this.errors = []
            Promise.all([vehicleBasicForm, vehicleOtherForm])
                .then(async (values) => {
                    let params = Object.assign(values[0], values[1])
                    this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addEditVehicleInfo(params)
                                .then((res) => {
                                    if (res.state) {
                                        this.resetForm()
                                        vehicleTable.getVehicleInfo()
                                        this.$message.success(res.msg)
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                })
                                .finally(() => {
                                    setTimeout(() => {
                                        this.loading = false
                                    }, 600)
                                })
                        },
                    })
                })
                .catch(() => {
                    const errors = Object.assign(
                        {},
                        vehicleBasicInfo.form.getFieldsError(),
                        vehicleOtherInfo.form.getFieldsError()
                    )
                    const tmp = { ...errors }
                    this.errorList(tmp)
                })
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false
                    }, 600)
                })
        },
        errorList(errors) {
            if (!errors || errors.length === 0) {
                return
            }
            this.errors = Object.keys(errors)
                .filter((key) => errors[key])
                .map((key) => ({
                    key: key,
                    message: errors[key][0],
                    fieldLabel: this.fieldLabels[key],
                }))
        },
        scrollToField(fieldKey) {
            const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
            if (labelNode) {
                labelNode.scrollIntoView(true)
            }
        },
        // 重置表单
        resetForm() {
            const {
                $refs: { vehicleBasicInfo, vehicleOtherInfo },
            } = this
            vehicleBasicInfo.form.resetFields()
            vehicleOtherInfo.form.resetFields()
        },
    },
}
</script>

<style lang="less" scoped>
.card {
    margin-bottom: 24px;
}
.popover-wrapper {
    /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
        min-width: 256px;
        max-height: 290px;
        padding: 0;
        overflow: auto;
    }
}
.antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
        margin-right: 4px;
    }
}
.antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
        float: left;
        margin-top: 4px;
        margin-right: 12px;
        padding-bottom: 22px;
        color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
        margin-top: 2px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
    }
}
</style>
