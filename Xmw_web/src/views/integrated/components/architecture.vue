<template>
    <div class="architecture">
        <a-row>
            <a-col :span="24">
                <a-checkbox v-model="horizontal"> 垂直展示 </a-checkbox>
                <a-checkbox v-model="collapsable"> 显示节点 </a-checkbox>
                <a-checkbox v-model="expandAll" @change="expandChange"> 展开全部 </a-checkbox>
                <a-select :default-value="labelClassName" style="width: 120px" @change="handleChange" size="small">
                    <a-select-option :value="item.value" v-for="(item, index) in labelClassNameItem" :key="index">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :span="24" style="text-align: center; overflow: auto">
                <a-spin v-if="spinning" />
                <vue2-org-tree
                    v-else
                    name="test"
                    :data="data"
                    :horizontal="horizontal"
                    :collapsable="collapsable"
                    :label-class-name="labelClassName"
                    :render-content="renderContent"
                    @on-expand="onExpand"
                    @on-node-click="onNodeClick"
                />
                <!-- 添加编辑Modal框 -->
                <a-modal v-model="modelVisible" :title="modelTitle" on-ok="handleOk">
                    <template slot="footer">
                        <a-button key="back" @click="modelVisible = false"> 取消 </a-button>
                        <a-button type="primary" @click="handleOk"> 提交 </a-button>
                    </template>
                    <a-row>
                        <a-col :span="24">
                            <a-input placeholder="请输入部门名称" v-model="departmentName" />
                        </a-col>
                    </a-row>
                </a-modal>
            </a-col>
        </a-row>
    </div>
</template>
<script>
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/src/styles/org-tree.less'
import { departmentList, addEditDepartment, deleteDepartment } from '@/api/integrated'
import { treeData } from '@/utils/util.js'
export default {
    components: {
        Vue2OrgTree,
    },
    data() {
        return {
            labelClassNameItem: [
                { value: 'bg-primary', label: '主题背景' },
                { value: 'bg-white', label: '洁白无瑕' },
                { value: 'bg-orange', label: '金橙' },
                { value: 'bg-gold', label: '金光灿灿' },
                { value: 'bg-gray', label: '珊瑚灰' },
                { value: 'bg-lightpink', label: '姹紫嫣红' },
                { value: 'bg-chocolate', label: '黑朱古力' },
                { value: 'bg-tomato', label: '红彤彤' },
            ],
            data: {},
            horizontal: false,
            collapsable: true,
            expandAll: true,
            labelClassName: 'bg-primary',
            spinning: true,
            modelVisible: false,
            modelTitle: '',
            departmentName: '',
            DepartmentID: '',
            parentId: '',
        }
    },
    methods: {
        handleChange(value) {
            this.labelClassName = value
        },
        renderContent(h, data) {
            return (
                <a-dropdown trigger={['contextmenu']}>
                    <div>{data.label}</div>
                    <a-menu slot="overlay" onclick={(key) => this.onClick(key, data)}>
                        <a-menu-item v-show={data.DepartmentID !== 1} key={'add'}>
                            添加同级部门
                        </a-menu-item>
                        <a-menu-item key={'addChild'}>添加下级部门</a-menu-item>
                        <a-menu-item key={'edit'}>修改部门</a-menu-item>
                        <a-menu-item key={'del'}>删除部门</a-menu-item>
                    </a-menu>
                </a-dropdown>
            )
        },
        onExpand: function (e, data) {
            if ('expand' in data) {
                data.expand = !data.expand

                if (!data.expand && data.children) {
                    this.collapse(data.children)
                }
            } else {
                this.$set(data, 'expand', true)
            }
        },
        async getDepartmentList() {
            let _this = this
            let params = {
                departmentName: '',
                createTime: JSON.stringify([]),
                current: 1,
                pageSize: 1,
            }
            await departmentList(params).then((res) => {
                if (res.state == 1) {
                    res.parentList.forEach((v) => {
                        ;(v.id = v.DepartmentID), (v.label = v.name)
                    })
                    _this.data = treeData(res.parentList, 'id', 'parentId', 'children')[0]
                    _this.spinning = false
                    _this.toggleExpand(this.data, this.expandAll)
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        onNodeClick(e, data) {},
        collapse(list) {
            var _this = this
            list.forEach(function (child) {
                if (child.expand) {
                    child.expand = false
                }
                child.children && _this.collapse(child.children)
            })
        },
        expandChange() {
            this.toggleExpand(this.data, this.expandAll)
        },
        toggleExpand(data, val) {
            var _this = this
            if (Array.isArray(data)) {
                data.forEach(function (item) {
                    _this.$set(item, 'expand', val)
                    if (item.children) {
                        _this.toggleExpand(item.children, val)
                    }
                })
            } else {
                this.$set(data, 'expand', val)
                if (data.children) {
                    _this.toggleExpand(data.children, val)
                }
            }
        },
        onClick(keyObj, node) {
            let _this = this
            if (keyObj.key === 'del') {
                // 删除部门
                if (node.children && node.children.length > 0) {
                    _this.$message.info('当前部门存在子部门，请先删除子部门')
                } else {
                    let params = {
                        DepartmentID: node.DepartmentID,
                        name: node.name,
                    }
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await deleteDepartment(params).then((res) => {
                                if (res.state == 1) {
                                    _this.$message.success(res.msg)
                                    _this.getDepartmentList()
                                } else if (res.state == 2) {
                                    _this.$message.warn(res.msg)
                                } else {
                                    _this.$message.error(res.msg)
                                }
                            })
                        },
                    })
                }
                return
            } else if (keyObj.key === 'edit') {
                // 编辑部门
                _this.modelTitle = `编辑部门:${node.name}`
                _this.DepartmentID = node.DepartmentID
                _this.parentId = node.parentId
                _this.departmentName = node.name
            } else if (keyObj.key === 'addChild') {
                _this.modelTitle = `添加下级部门:[${node.name}]`
                _this.DepartmentID = ''
                _this.parentId = node.DepartmentID
                _this.departmentName = ''
            } else if (keyObj.key === 'add') {
                _this.modelTitle = `添加同级部门:[${node.name}]`
                _this.DepartmentID = ''
                _this.parentId = node.parentId
                _this.departmentName = ''
            }
            _this.modelVisible = true
        },
        handleOk() {
            let _this = this
            if (!_this.departmentName) {
                _this.$message.warn('部门名称不能为空!')
                return false
            }
            let params = {
                DepartmentID: _this.DepartmentID,
                name: _this.departmentName,
                parentId: _this.parentId,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认提交吗?',
                onOk: async () => {
                    await addEditDepartment(params).then((res) => {
                        if (res.state == 1) {
                            _this.modelVisible = false
                            _this.$message.success(res.msg)
                            _this.getDepartmentList()
                        } else if (res.state == 2) {
                            _this.$message.warn(res.msg)
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
            await this.getDepartmentList()
        })
    },
}
</script>
<style lang="less">
@import '~@/components/index.less';
.org-tree-node-label {
    white-space: nowrap;
}
.bg-primary {
    background-color: @primary-color;
}
.bg-white {
    background-color: white;
}
.bg-orange {
    background-color: orange;
}
.bg-gold {
    background-color: gold;
}
.bg-gray {
    background-color: gray;
}
.bg-lightpink {
    background-color: lightpink;
}
.bg-chocolate {
    background-color: chocolate;
}
.bg-tomato {
    background-color: tomato;
}
</style>