<template>
    <page-header-wrapper
        content="该模块主要是为了记录用户在内部系统上的操作日志，记录操作日志是web系统做安全审计和系统维护的重要手段。"
    >
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="用户名">
                                <a-input placeholder="请输入" v-model="username" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="创建时间">
                                <a-range-picker v-model="createTime" valueFormat="YYYY-MM-DD" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-button type="primary" @click="query" v-action:query>查询</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <!-- 表格数据 -->
            <a-table
                :columns="columns"
                rowKey="ID"
                :data-source="data"
                :pagination="pagination"
                @change="tableChange"
                :loading="loading"
            >
            </a-table>
        </a-card>
    </page-header-wrapper>
</template>

<script>
import { Logs } from '@/api/system'
import { dataFormat } from '@/utils/util.js'
export default {
    name: 'logs',
    data() {
        return {
            columns: [
                { title: '用户名', dataIndex: 'username', key: 'username', ellipsis: true },
                { title: '中文名', dataIndex: 'CnName', key: 'CnName', ellipsis: true },
                { title: '操作', dataIndex: 'action', key: 'action', ellipsis: true },
                { title: 'IP', dataIndex: 'IP', key: 'IP', ellipsis: true },
                { title: '路由', dataIndex: 'path', key: 'path', ellipsis: true },
                { title: '代理', dataIndex: 'userAgent', key: 'userAgent', ellipsis: true },
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
            ],
            data: [],
            username: '',
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
        }
    },
    methods: {
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getLogsList()
        },
        async getLogsList() {
            let _this = this
            _this.loading = true
            let params = {
                username: _this.username,
                createTime: JSON.stringify(_this.createTime),
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await Logs(params).then((res) => {
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
            this.getLogsList()
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getLogsList()
        })
    },
}
</script>

<style>
</style>