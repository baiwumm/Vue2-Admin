<template>
    <page-header-wrapper :title="'出差编号:' + tripNum">
        <template v-slot:extra>
            <a-radio-group default-value="approval" button-style="solid">
                <a-radio-button value="freeze"> 冻结 </a-radio-button>
                <a-radio-button value="undo"> 撤销 </a-radio-button>
                <a-radio-button value="approval"> 审批 </a-radio-button>
            </a-radio-group>
        </template>
        <template v-slot:content>
            <a-descriptions>
                <a-descriptions-item label="出差人">Aresn</a-descriptions-item>
                <a-descriptions-item label="审批人"> aven </a-descriptions-item>
                <a-descriptions-item label="出差事由">与客户签署合同</a-descriptions-item>
                <a-descriptions-item label="合同编号"> YJ2020020号 </a-descriptions-item>
                <a-descriptions-item label="出差时间"> 2021-01-01 ~ 2021-02-08 </a-descriptions-item>
                <a-descriptions-item label="备注"> 请于两个工作日内审批</a-descriptions-item>
            </a-descriptions>
        </template>
        <template v-slot:extraContent>
            <a-row style="text-align: center">
                <a-col :span="12">
                    <div class="text">状态</div>
                    <div class="heading" style="margin-top: 5px"><a-tag color="red"> 待通过 </a-tag></div>
                </a-col>
                <a-col :span="12">
                    <div class="text">金额</div>
                    <div class="heading" style="font-size: 20px">{{ '¥' + formatDigital(19526.25, 2) }}</div>
                </a-col>
            </a-row>
        </template>
        <div class="ant-pro-grid-content">
            <!-- 审批流程 -->
            <a-card title="审批流程" hoverable>
                <a-steps :current="1">
                    <a-step>
                        <template slot="title"> 提交申请 </template>
                        <div slot="description" style="width: auto">
                            申请人:Aresn<a-icon type="dingding" style="margin-left: 6px" />
                            <div class="time">
                                <a-tooltip>
                                    <template slot="title"> 申请时间 </template>
                                    <a-badge color="green" />
                                </a-tooltip>
                                2021-01-01 13:52
                            </div>
                        </div>
                    </a-step>
                    <a-step>
                        <template slot="title"> Leader审批 </template>
                        <div slot="description">
                            审批人:aven<span>
                                <a-tooltip>
                                    <template slot="title"> 钉一下 </template>
                                    <a-icon type="dingding" style="margin-left: 6px; color: rgb(0, 160, 233)" />
                                </a-tooltip>
                            </span>
                            <div class="time">
                                <a-tooltip>
                                    <template slot="title"> 审核状态 </template>
                                    <a-badge color="red" text="驳回" />
                                </a-tooltip>
                            </div>
                        </div>
                    </a-step>
                    <a-step>
                        <template slot="title"> 财务复核 </template>
                        <div slot="description">
                            复核人:lucy<a-icon type="dingding" style="margin-left: 6px" />
                            <div class="time">
                                <a-tooltip>
                                    <template slot="title"> 复核状态 </template>
                                    <a-badge color="cyan" text="待复核" />
                                </a-tooltip>
                            </div>
                        </div>
                    </a-step>
                </a-steps>
            </a-card>
            <!-- 行程信息 -->
            <a-card title="行程信息" hoverable style="margin-top: 24px">
                <a-descriptions>
                    <a-descriptions-item label="出发城市">广州市</a-descriptions-item>
                    <a-descriptions-item label="出发时间"> 2021-01-01 </a-descriptions-item>
                    <a-descriptions-item label="返程时间">2021-02-08</a-descriptions-item>
                    <a-descriptions-item label="交通类型"> 飞机 </a-descriptions-item>
                    <a-descriptions-item label="航班到达城市"> 吉林市 </a-descriptions-item>
                    <a-descriptions-item label="负责人"> Aresn</a-descriptions-item>
                </a-descriptions>
            </a-card>
            <!-- 同行人员 -->
            <a-card title="同行人员" hoverable style="margin-top: 24px">
                <a-table rowKey="name" :columns="columns" :data-source="data" :bordered="false" :pagination="false" />
            </a-card>
            <!-- 出差记录 -->
            <a-card title="近半年来出差记录" hoverable style="margin-top: 24px"><a-empty /></a-card>
        </div>
    </page-header-wrapper>
</template>

<script>
import { filterDigital } from '@/utils/util'
export default {
    name: 'advancedDetails',
    data() {
        return {
            tripNum: 'YJ2020020号',
            columns: [
                {
                    title: '姓名',
                    dataIndex: 'name',
                },
                {
                    title: '工号',
                    dataIndex: 'workNum',
                },
                {
                    title: '部门',
                    dataIndex: 'department',
                },
            ],
            data: [
                {
                    name: 'John Brown',
                    workNum: '001',
                    department: '开发部',
                },
                {
                    name: 'Jim Green',
                    workNum: '002',
                    department: '设计部',
                },
                {
                    name: 'Joe Black',
                    workNum: '003',
                    department: '产品部',
                },
            ],
        }
    },
    methods: {
        // 格式化数字
        formatDigital(value, decimal) {
            return filterDigital(value, decimal)
        },
    },
}
</script>

<style lang="less" scoped>
</style>