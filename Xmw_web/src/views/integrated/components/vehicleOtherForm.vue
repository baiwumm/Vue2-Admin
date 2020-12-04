<template>
    <a-form @submit="handleSubmit" :form="form" class="form">
        <a-row class="form-row" :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
                <a-form-item label="车主">
                    <a-input v-decorator="rules.owner" placeholder="请输入车主" allowClear />
                </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
                <a-form-item label="登记时间">
                    <a-date-picker
                        v-decorator="rules.registrationTime"
                        style="width: 100%"
                        format="YYYY-MM-DD"
                        placeholder="请选择登记时间"
                    />
                </a-form-item>
            </a-col>
            <a-col :xl="{ span: 9, offset: 1 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
                <a-form-item label="车辆品牌">
                    <a-input v-decorator="rules.brand" placeholder="请输入车辆品牌" allowClear />
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="12" :sm="24">
                <a-form-item label="地址">
                    <a-cascader placeholder="请选择地址" v-decorator="rules.address" :options="cityJson" />
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item v-if="showSubmit">
            <a-button htmlType="submit">保存</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import cities from '@/core/cities.json'
export default {
    name: 'vehicleOtherForm',
    props: {
        showSubmit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            form: this.$form.createForm(this),
            rules: {
                owner: ['owner', { rules: [{ required: true, message: '请输入车主' }] }],
                registrationTime: ['registrationTime', { rules: [{ required: true, message: '请选择登记时间' }] }],
                brand: ['brand', { rules: [{ required: true, message: '请输入车辆品牌' }] }],
                address: ['address', { rules: [{ required: true, message: '请选择地址' }] }],
            },
            cityJson: cities.options,
        }
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                }
            })
        },
    },
}
</script>

<style scoped>
</style>
