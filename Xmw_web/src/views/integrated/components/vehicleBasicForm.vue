<template>
    <a-form @submit="handleSubmit" :form="form" class="form">
        <a-row class="form-row" :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
                <a-form-item label="车牌号码">
                    <a-input v-decorator="rules.VLPN" placeholder="请输入车牌号码" allowClear />
                </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
                <a-form-item label="车牌颜色">
                    <a-select v-decorator="rules.VLPNColor" style="width: 100%" placeholder="请选择车牌颜色" allowClear>
                        <a-select-option v-for="item in VLPNColorList" :key="item.value" :value="item.value">
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :xl="{ span: 9, offset: 1 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
                <a-form-item label="车辆类型">
                    <a-select
                        v-decorator="rules.vehicleType"
                        style="width: 100%"
                        placeholder="请选择车辆类型"
                        allowClear
                    >
                        <a-select-option v-for="item in CarTypeList" :key="item.value" :value="item.value">
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="12" :sm="24">
                <a-form-item label="排放标准">
                    <a-select
                        v-decorator="rules.emissionstandard"
                        style="width: 100%"
                        placeholder="请选择排放标准"
                        allowClear
                    >
                        <a-select-option v-for="item in EmissionstandardList" :key="item.value" :value="item.value">
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
                <a-form-item label="座位数">
                    <a-input-number :min="1" :max="10" v-decorator="rules.seating" style="width: 100%" />
                </a-form-item>
            </a-col>
            <a-col :xl="{ span: 9, offset: 1 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
                <a-form-item label="燃油类型">
                    <a-select v-decorator="rules.FuleType" style="width: 100%" placeholder="请选择燃油类型" allowClear>
                        <a-select-option v-for="item in FuelTypeList" :key="item.value" :value="item.value">
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-form-item v-if="showSubmit">
            <a-button htmlType="submit">保存</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import { DictionaryCD } from '@/api/public'
export default {
    name: 'vehicleBasicForm',
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
                VLPN: [
                    'VLPN',
                    { rules: [{ required: true, message: '请输入车牌号码' }, { validator: this.validatorVLPN }] },
                ],
                VLPNColor: ['VLPNColor', { rules: [{ required: true, message: '请选择车牌颜色' }] }],
                vehicleType: ['vehicleType', { rules: [{ required: true, message: '请选择车辆类型' }] }],
                emissionstandard: ['emissionstandard', { rules: [{ required: true, message: '请选择排放标准' }] }],
                seating: ['seating', { initialValue: 1 }],
                FuleType: ['FuleType', { rules: [{ required: true, message: '请选择燃油类型' }] }],
            },
            CarTypeList: [], // 车辆类型CD表
            VLPNColorList: [], // 车牌颜色CD表
            FuelTypeList: [], // 燃油类型CD表
            EmissionstandardList: [], // 排放标准CD表
        }
    },
    methods: {
        validatorVLPN(rule, value, callback) {
            const VLPNReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
            if (!VLPNReg.test(value)) {
                callback('请输入正确的车牌号码!')
                return //校验不通过结束当前校验
            }
            callback() //必须调用，参数为空视为校验通过
        },
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.CarTypeList = res.result.cd_car_type
                _this.VLPNColorList = res.result.cd_vlpn_color
                _this.FuelTypeList = res.result.cd_fuel_type
                _this.EmissionstandardList = res.result.cd_emissionstandard
            })
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                }
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getDictionaryCD()
        })
    },
}
</script>

<style scoped>
</style>
