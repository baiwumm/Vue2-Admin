import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
    antLocale: antdEnUS,
    momentName: 'eu',
    momentLocale: momentEU
}

const locale = {
    'message': '-',
    'menu.home': 'Home',
    'menu.workbench': 'Workbench',
    'menu.integrated': 'Integrated',
    'menu.integrated.advancedForm': 'AdvancedForm',
    'menu.integrated.organizational': 'Organizational',
    'menu.integrated.advancedTable': 'AdvancedTable',
    'menu.integrated.Announcement': 'Announcement',
    'menu.integrated.advancedDetails': 'AdvancedDetails',
    'menu.features': 'Features',
    'menu.features.qrcode': 'Qrcode',
    'menu.features.quillEditor': 'QuillEditor',
    'menu.features.customDirective': 'CustomDirective',
    'menu.features.imageRecognition': 'ImageRecognition',
    'menu.features.chatRoom': 'ChatRoom',
    'menu.features.waterfall': 'WaterFall',
    'menu.features.musicPlayer': 'MusicPlayer',
    'menu.features.videoPlayer': 'VideoPlayer',
    'menu.features.lazyLoad': 'LazyLoad',
    'menu.features.virtualList': 'VirtualList',
    'menu.toolpage': 'ToolPage',
    'menu.toolpage.multistage': 'Multistage',
    'menu.toolpage.multistage.menu1': 'Menu1',
    'menu.toolpage.multistage.menu1.menu1-1': 'Menu1-1',
    'menu.toolpage.multistage.menu2': 'Menu2',
    'menu.toolpage.pictureEffect': 'PictureEffect',
    'menu.toolpage.imagePreview': 'ImagePreview',
    'menu.toolpage.verify': 'Verify',
    'menu.toolpage.guide': 'Guide',
    'menu.toolpage.outerChain': 'OuterChain',
    'menu.toolpage.cardFrom': 'CardFrom',
    'menu.personal.center': 'PersonalCenter',
    'menu.system': 'System',
    'menu.system.logs': 'Logs',
    'menu.system.menu': 'Menu',
    'menu.system.user': 'User',
    'menu.system.role': 'Role',
    'menu.system.permission': 'Permission',
    'menu.system.dictionary': 'Dictionary',
    'menu.system.subDictionary': 'SubDictionary',

    'layouts.usermenu.dialog.title': 'Message',
    'layouts.usermenu.dialog.content': 'Do you really log-out?',

    'app.setting.pagestyle': 'Page style setting',
    'app.setting.pagestyle.light': 'Light style',
    'app.setting.pagestyle.dark': 'Dark style',
    'app.setting.pagestyle.realdark': 'RealDark style',
    'app.setting.themecolor': 'Theme Color',
    'app.setting.navigationmode': 'Navigation Mode',
    'app.setting.content-width': 'Content Width',
    'app.setting.fixedheader': 'Fixed Header',
    'app.setting.fixedsidebar': 'Fixed Sidebar',
    'app.setting.sidemenu': 'Side Menu Layout',
    'app.setting.topmenu': 'Top Menu Layout',
    'app.setting.content-width.fixed': 'Fixed',
    'app.setting.content-width.fluid': 'Fluid',
    'app.setting.othersettings': 'Other Settings',
    'app.setting.weakmode': 'Weak Mode',
    'app.setting.copy': 'Copy Setting',
    'app.setting.loading': 'Loading theme',
    'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
    'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify'
}

export default {
    ...components,
    ...locale
}
