<template>
  <a-row :gutter="16" style="padding-bottom: 30px">
    <a-divider orientation="left">{{ I18nUser('personalInfo') }}</a-divider>
    <a-col :span="12">
      <a-form-item :label="I18nUser('userName')">
        <a-input
          v-decorator="rules.userName"
          :placeholder="I18nEntry(I18nUser('userName'))"
          :max-length="20"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('cnName')">
        <a-input v-decorator="rules.cnName" :placeholder="I18nEntry(I18nUser('cnName'))" :max-length="20" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('phone')">
        <a-input v-decorator="rules.phone" :placeholder="I18nEntry(I18nUser('phone'))" :max-length="11" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('email')">
        <a-input v-decorator="rules.email" :placeholder="I18nEntry(I18nUser('email'))" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('sex')">
        <a-radio-group v-decorator="rules.sex">
          <a-radio :value="Sex.Male"> {{ I18nUser('sex.male') }} </a-radio>
          <a-radio :value="Sex.Female"> {{ I18nUser('sex.female') }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t(I18nGlobal.Status)">
        <a-radio-group v-decorator="rules.status">
          <a-radio :value="Status.Active"> {{ $t(I18nGlobal.StatusNormal) }} </a-radio>
          <a-radio :value="Status.Inactive"> {{ $t(I18nGlobal.StatusForbidden) }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="$t(I18nGlobal.Sort)">
        <a-input-number
          v-decorator="rules.sort"
          :placeholder="I18nEntry($t(I18nGlobal.Sort))"
          :min="1"
          :max="9999"
          style="width: 100%"
        />
      </a-form-item>
    </a-col>
    <template v-if="!id">
      <a-col :span="24">
        <a-form-item :label="I18nUser('password')">
          <a-input
            v-decorator="rules.password"
            :placeholder="I18nEntry(I18nUser('password'))"
            :max-length="20"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item :label="I18nUser('confirmPassword')">
          <a-input
            v-decorator="rules.confirmPassword"
            :placeholder="I18nEntry(I18nUser('confirmPassword'))"
            :max-length="20"
            allow-clear
          />
        </a-form-item>
      </a-col>
    </template>
    <a-divider orientation="left">{{ I18nUser('userInfo') }}</a-divider>
    <a-col :span="12">
      <a-form-item :label="I18nUser('roleId')">
        <a-select v-decorator="rules.roleId" :placeholder="I18nSelect(I18nUser('roleId'))">
          <a-select-option :value="r.id" v-for="r in roleList" :key="r.id">
            {{ r.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('orgId')">
        <a-tree-select
          v-decorator="rules.orgId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="orgList"
          :placeholder="I18nSelect(I18nUser('orgId'))"
          :replaceFields="{ value: 'id', label: 'name', children: 'children' }"
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('postId')">
        <a-tree-select
          v-decorator="rules.postId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="postList"
          :placeholder="I18nSelect(I18nUser('postId'))"
          :replaceFields="{ value: 'id', label: 'name', children: 'children' }"
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nUser('city')">
        <a-cascader v-decorator="rules.city" :options="regionData" :placeholder="I18nSelect(I18nUser('city'))" />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nUser('address')">
        <a-textarea
          v-decorator="rules.address"
          :placeholder="I18nEntry(I18nUser('address'))"
          :max-length="200"
          allow-clear
          :rows="4"
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nUser('tags')">
        <user-tags v-decorator="rules.tags" />
      </a-form-item>
    </a-col>
    <a-divider orientation="left">{{ I18nUser('settingAvatar') }}</a-divider>
    <a-col :span="24">
      <a-form-item>
        <setting-avatar v-decorator="rules.avatar" />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import { regionData } from 'element-china-area-data'
import { get } from 'lodash-es'

import { getOrgList } from '@/api/administrative/organization'
import { getPostList } from '@/api/administrative/post'
import { getRoleList } from '@/api/system-manage/role-manage'
import UserTags from '@/components/UserTags'
import { RequestCode, Sex, Status } from '@/constant'
import { ActionOptions } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nSelect, I18nUser } from '@/constant/i18n'

import SettingAvatar from './SettingAvatar.vue'
export default {
  name: 'FormModal',
  props: ['data', 'rules', 'id'],
  components: { UserTags, SettingAvatar },
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nUser,
      ActionOptions,
      Sex,
      Status,
      roleList: [],
      roleLoading: false,
      orgList: [],
      orgLoading: false,
      postList: [],
      postLoading: false,
      regionData
    }
  },
  methods: {
    // 获取角色列表
    async fetchRoleList() {
      this.roleLoading = true
      const params = {
        current: 1,
        size: 999
      }
      const { data, code } = await getRoleList(params)
      if (code === RequestCode.Success) {
        this.roleList = get(data, 'records', [])
      }
      this.roleLoading = false
    },
    // 获取组织列表
    async fetchOrgList() {
      this.orgLoading = true
      const { data, code } = await getOrgList({})
      if (code === RequestCode.Success) {
        this.orgList = get(data, 'records', [])
      }
      this.orgLoading = false
    },
    // 获取岗位列表
    async fetchPostList() {
      this.postLoading = true
      const { data, code } = await getPostList({})
      if (code === RequestCode.Success) {
        this.postList = get(data, 'records', [])
      }
      this.postLoading = false
    }
  },
  mounted() {
    this.fetchRoleList()
    this.fetchOrgList()
    this.fetchPostList()
  }
}
</script>
