import {
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  Menu,
  message,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Result,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  TimePicker,
  Tooltip,
  Tree,
  TreeSelect,
  Upload
} from 'ant-design-vue'
import Viser from 'viser-vue'
import Vue from 'vue'
import VueCropper from 'vue-cropper'

import Dialog from '@/components/Dialog'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
import defaultSettings from '@/config/defaultSettings'
import PermissionHelper from '@/core/permission/permission'

import pkg from '../../package.json'
import Directives from './directives'

Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Card)
Vue.use(Form)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Breadcrumb)
Vue.use(Steps)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Drawer)
Vue.use(Tooltip)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Skeleton)
Vue.use(Popconfirm)
Vue.use(PageHeader)
Vue.use(Result)
Vue.use(Statistic)
Vue.use(Descriptions)
Vue.use(Space)
Vue.use(TreeSelect)
Vue.use(Tree)
Vue.use(Timeline)
Vue.use(Cascader)
Vue.use(BackTop)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning

Vue.use(Viser)
Vue.use(Dialog) // this.$dialog func
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(PermissionHelper)
Vue.use(VueCropper)
Vue.use(Directives)

console.log(
  `%c ${defaultSettings.title} %c 邮箱地址：${pkg.author.email}`,
  'background-color:rgb(3,3,7);font-size:12px;padding:8px;color:rgb(250,223,123);',
  'background-color:rgb(250,223,123);font-size:12px;padding:8px;color:rgb(3,3,7);'
)
