import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
    antLocale: antd,
    momentName: 'zh-cn',
    momentLocale: momentCN
}

const locale = {
    'message': '-',
    'menu.home': '主页',
    'menu.workbench': '工作台',
    'menu.integrated': '综合组件',
    'menu.integrated.advancedForm': '高级表单',
    'menu.integrated.organizational': '组织架构',
    'menu.integrated.seniorForms': '高级表格',
    'menu.integrated.Announcement': '消息公告',
    'menu.features': '功能页',
    'menu.features.qrcode': '生成二维码',
    'menu.features.multistage': '嵌套路由',
    'menu.features.multistage.contrast': '图片对比',
    'menu.features.quillEditor': '富文本编辑器',
    'menu.features.customDirective': '自定义Vue指令',
    'menu.features.imageRecognition': '图像识别',
    'menu.personal.center': '个人中心',
    'menu.system': '系统设置',
    'menu.system.logs': '操作日志',
    'menu.system.menu': '菜单管理',
    'menu.system.UserList': '用户列表',
    'menu.system.RoleList': '角色管理',
    'menu.system.PermissionList': '权限管理',
    'layouts.usermenu.dialog.title': '确认操作',
    'layouts.usermenu.dialog.content': '你真的要退出吗?',
    'app.setting.pagestyle': '页面样式',
    'app.setting.pagestyle.light': '明亮模式',
    'app.setting.pagestyle.dark': '暗黑模式',
    'app.setting.pagestyle.realdark': '全黑模式',
    'app.setting.themecolor': '主体颜色',
    'app.setting.navigationmode': '导航模式',
    'app.setting.content-width': '内容宽度',
    'app.setting.fixedheader': '头部固定',
    'app.setting.fixedsidebar': '侧边栏固定',
    'app.setting.sidemenu': '侧边栏布局',
    'app.setting.topmenu': '顶部菜单布局',
    'app.setting.content-width.fixed': '固定',
    'app.setting.content-width.fluid': '流体',
    'app.setting.othersettings': '其他设置',
    'app.setting.weakmode': '弱模式',
    'app.setting.copy': '复制设置',
    'app.setting.loading': '主题加载',
    'app.setting.copyinfo': '复制成功，请替换默认设置 src/models/setting.js',
    'app.setting.production.hint': '设置面板只在开发环境中显示，请手动修改'
}

export default {
    ...components,
    ...locale
}
