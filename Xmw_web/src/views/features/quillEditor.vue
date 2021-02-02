<template>
    <page-header-wrapper content="富文本编辑器转换成html,基于Vue-Quill-Editor,从后端返回的数据需要转码再生成Html">
        <a-row :gutter="16">
            <a-col :span="12">
                <a-card :hoverable="true">
                    <quill-editor
                        v-model="editContent"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)"
                    >
                    </quill-editor>
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card :hoverable="true" title="富文本编辑器转换成html演示">
                    <!-- 从数据库读取展示 -->
                    <div class="ql-container ql-snow">
                        <div class="ql-editor">
                            {{ conversion }}
                        </div>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    components: {
        quillEditor,
    },
    data() {
        return {
            editContent: '<h1><strong>Vue XmwPro</strong></h1>', // 编辑器内容
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
                        ['image', 'video'], //上传图片、上传视频
                    ],
                },
            },
            conversion: '', // 演示内容
        }
    },
    methods: {
        onEditorReady(editor) {
            // 准备编辑器
        },
        onEditorBlur() {}, // 失去焦点事件
        onEditorFocus() {}, // 获得焦点事件
        // 内容改变事件
        onEditorChange() {
            this.conversion = this.escapeStringHTML(this.editContent)
        },
        // 转码
        escapeStringHTML(content) {
            content = content.replace(/&lt;/g, '<')
            content = content.replace(/&gt;/g, '>')
            return content
        },
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.conversion = this.escapeStringHTML(this.editContent)
        })
    },
}
</script>

<style lang="less" scoped>
.quill-editor /deep/ .ql-container {
    min-height: 490px;
}
.ql-container {
    min-height: 500px;
}
</style>