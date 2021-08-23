<template>
    <a-card>
        <a-table
            :columns="columns"
            rowKey="ID"
            :data-source="data"
            :pagination="pagination"
            @change="tableChange"
            :loading="loading"
        >
            <template v-for="col in ['owner', 'brand']" :slot="col" slot-scope="text, record">
                <div :key="col">
                    <a-input v-if="record.editable" v-model="formData[col]" />
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template slot="vehicleType" slot-scope="text, record">
                <a-select v-if="record.editable" placeholder="请选择车辆类型" allowClear v-model="formData.vehicleType">
                    <a-select-option v-for="item in CarTypeList" :key="item.value" :value="item.value">
                        {{ item.text }}
                    </a-select-option>
                </a-select>
                <template v-else> {{ CarTypeObj[text] }} </template>
            </template>
            <template slot="seating" slot-scope="text, record">
                <a-input-number v-if="record.editable" :min="1" :max="10" v-model="formData.seating" />
                <template v-else>
                    <a-tag color="blue">{{ text }}</a-tag>
                </template>
            </template>
            <template slot="emissionstandard" slot-scope="text, record">
                <a-select
                    v-if="record.editable"
                    placeholder="请选择排放标准"
                    allowClear
                    v-model="formData.emissionstandard"
                >
                    <a-select-option v-for="item in EmissionstandardList" :key="item.value" :value="item.value">
                        {{ item.text }}
                    </a-select-option>
                </a-select>
                <template v-else>
                    {{ EmissionstandardObj[text] }}
                </template>
            </template>
            <template slot="FuleType" slot-scope="text, record">
                <a-select v-if="record.editable" placeholder="请选择燃油类型" allowClear v-model="formData.FuleType">
                    <a-select-option v-for="item in FuelTypeList" :key="item.value" :value="item.value">
                        {{ item.text }}
                    </a-select-option>
                </a-select>
                <template v-else>
                    {{ FuelTypeObj[text] }}
                </template>
            </template>
            <template slot="address" slot-scope="text, record">
                <a-cascader
                    v-if="record.editable"
                    v-model="formData.address"
                    :options="cityJson"
                    placeholder="请选择地址"
                />
                <template v-else>
                    {{ text ? text.join('') : '' }}
                </template>
            </template>
            <template slot="registrationTime" slot-scope="text, record">
                <a-date-picker
                    v-if="record.editable"
                    :value="momenTime(formData.registrationTime)"
                    format="YYYY-MM-DD"
                    @change="changeTime"
                    placeholder="请选择日期"
                />
                <template v-else>
                    {{ text }}
                </template>
            </template>
            <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a-space>
                            <a-popconfirm title="确认保存?" @confirm="() => saveInfo(record.ID)">
                                <a-button type="primary" size="small">保存</a-button>
                            </a-popconfirm>
                            <a-popconfirm title="确认取消?" @confirm="() => cancelInfo(record.ID)">
                                <a-button size="small">取消</a-button>
                            </a-popconfirm>
                        </a-space>
                    </span>
                    <span v-else>
                        <a-space>
                            <a-button
                                v-action:edit
                                :disabled="editingID !== ''"
                                type="primary"
                                icon="edit"
                                @click="editInfo(record.ID)"
                                size="small"
                            />
                            <a-button
                                v-action:delete
                                :disabled="editingID !== ''"
                                type="danger"
                                icon="delete"
                                @click="deleteInfo(record)"
                                size="small"
                            />
                        </a-space>
                    </span>
                </div>
            </template>
        </a-table>
    </a-card>
</template>

<script>
import { vehicleInfo } from '@/api/integrated'
import { dataFormat, setVLPNColor } from '@/utils/util.js'
import { DictionaryCD } from '@/api/public'
import moment from 'moment'
import cities from '@/core/cities.json'
import { addEditVehicleInfo, deleteVehicleInfo } from '@/api/integrated'
import cloneDeep from 'lodash/cloneDeep'
export default {
    data() {
        return {
            cityJson: cities.options,
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 20,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            columns: [
                {
                    title: '车牌号码',
                    dataIndex: 'VLPN',
                    key: 'VLPN',
                    customRender: (text, row, index) => {
                        let style = this.setVLPNColor(row.VLPNColor)
                        return <span style={style}>{text}</span>
                    },
                },
                {
                    title: '车辆类型',
                    dataIndex: 'vehicleType',
                    key: 'vehicleType',
                    scopedSlots: { customRender: 'vehicleType' },
                },
                {
                    title: '排放标准',
                    dataIndex: 'emissionstandard',
                    key: 'emissionstandard',
                    scopedSlots: { customRender: 'emissionstandard' },
                },
                {
                    title: '座位数',
                    dataIndex: 'seating',
                    key: 'seating',
                    scopedSlots: { customRender: 'seating' },
                },
                {
                    title: '燃油类型',
                    dataIndex: 'FuleType',
                    key: 'FuleType',
                    scopedSlots: { customRender: 'FuleType' },
                },
                {
                    title: '车主',
                    dataIndex: 'owner',
                    key: 'owner',
                    scopedSlots: { customRender: 'owner' },
                },
                {
                    title: '品牌',
                    dataIndex: 'brand',
                    key: 'brand',
                    scopedSlots: { customRender: 'brand' },
                },
                {
                    title: '地址',
                    dataIndex: 'address',
                    key: 'address',
                    scopedSlots: { customRender: 'address' },
                },
                {
                    title: '登记时间',
                    dataIndex: 'registrationTime',
                    key: 'registrationTime',
                    scopedSlots: { customRender: 'registrationTime' },
                },
                // {
                //     title: '创建时间',
                //     dataIndex: 'createTime',
                //     key: 'createTime',
                //     scopedSlots: { customRender: 'createTime' },
                // },
                {
                    title: '操作',
                    key: 'operation',
                    scopedSlots: { customRender: 'operation' },
                },
            ],
            data: [],
            editable: false,
            CarTypeList: [], // 车辆类型CD表
            CarTypeObj: {},
            VLPNColorList: [], // 车牌颜色CD表
            FuelTypeList: [], // 燃油类型CD表
            FuelTypeObj: {},
            EmissionstandardList: [], // 排放标准CD表
            EmissionstandardObj: {},
            editingID: '',
            formData: {}, //表单数据
        }
    },
    methods: {
        // 设置车牌
        setVLPNColor(VLPNColor) {
            return setVLPNColor(VLPNColor)
        },
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.CarTypeList = res.result.cd_car_type
                _this.CarTypeList.map((v) => {
                    _this.CarTypeObj[v.value] = v.text
                })
                _this.VLPNColorList = res.result.cd_vlpn_color
                _this.FuelTypeList = res.result.cd_fuel_type
                _this.FuelTypeList.map((v) => {
                    _this.FuelTypeObj[v.value] = v.text
                })
                _this.EmissionstandardList = res.result.cd_emissionstandard
                _this.EmissionstandardList.map((v) => {
                    _this.EmissionstandardObj[v.value] = v.text
                })
            })
        },
        // 切换分页
        tableChange(e) {
            let _this = this
            _this.pagination.defaultCurrent = e.current
            _this.pagination.defaultPageSize = e.pageSize
            _this.getVehicleInfo()
        },
        async getVehicleInfo() {
            let _this = this
            _this.loading = true
            let params = {
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await vehicleInfo(params).then((res) => {
                if (res.state == 1) {
                    _this.data = res.result.list
                    _this.data.forEach((v) => {
                        v.address = JSON.parse(v.address)
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd')
                        v.registrationTime = dataFormat(v.registrationTime, 'yyyy-MM-dd')
                    })
                    _this.pagination.total = res.result.total
                } else {
                    _this.$message.error(res.msg)
                }
                _this.loading = false
            })
        },
        momenTime(time) {
            return moment(time, 'YYYY-MM-DD')
        },
        changeTime(date, dateString) {
            this.formData.registrationTime = dateString
        },
        // 编辑
        editInfo(ID) {
            let _this = this
            const newData = [..._this.data]
            const target = newData.filter((item) => ID === item.ID)[0]
            _this.formData = cloneDeep(target)
            _this.editingID = ID
            if (target) {
                target.editable = true
                _this.data = newData
            }
        },
        // 取消
        cancelInfo(ID) {
            let _this = this
            const newData = [..._this.data]
            const target = newData.filter((item) => ID === item.ID)[0]
            _this.editingID = ''
            if (target) {
                delete target.editable
                _this.data = newData
            }
            _this.formData = {}
        },
        // 保存
        async saveInfo() {
            let _this = this
            await addEditVehicleInfo(_this.formData).then((res) => {
                if (res.state) {
                    _this.$message.success(res.msg)
                    _this.editingID = ''
                    _this.getVehicleInfo()
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        // 删除
        deleteInfo(record) {
            let _this = this
            let params = {
                ID: record.ID,
                VLPN: record.VLPN,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认删除吗?',
                onOk: async () => {
                    await deleteVehicleInfo(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getVehicleInfo()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
    },
    mounted() {
        this.$nextTick(async () => {
            await this.getDictionaryCD()
            this.getVehicleInfo()
        })
    },
}
</script>

<style>
</style>
<style>
</style>