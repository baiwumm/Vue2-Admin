
<template>
    <page-header-wrapper content="个人中心主要用于用户信息资料的修改，支持自定义头像、用户标签等，并可在其基础拓展。">
        <div class="page-header-index-wide page-header-wrapper-grid-content-main">
            <a-row :gutter="24">
                <a-col :md="24" :lg="7">
                    <a-card :bordered="false">
                        <div class="account-center-avatarHolder">
                            <div class="avatar">
                                <a-avatar :size="104" :src="user.avatar" v-if="user.avatar" />
                                <a-avatar :size="104" v-else class="user-avatar">{{
                                    user.CnName.substr(user.CnName.length - 2, 2)
                                }}</a-avatar>
                            </div>
                            <div class="username">{{ user.CnName }}</div>
                            <div class="bio">{{ user.motto }}</div>
                        </div>
                        <div class="account-center-detail">
                            <p><i class="title"></i>{{ jobs }}</p>
                            <p><i class="group"></i>{{ department }}</p>
                            <p>
                                <i class="address"></i>
                                {{ address }}
                            </p>
                        </div>
                        <a-divider />

                        <div class="account-center-tags">
                            <div class="tagsTitle">标签</div>
                            <div>
                                <vuedraggable :list="tags" @change="changeDra">
                                    <template v-for="(tag, index) in tags" v-key="index">
                                        <a-tooltip v-if="tag.length > 8" :key="tag" :title="tag">
                                            <a-tag
                                                :key="tag"
                                                :closable="true"
                                                @close="handleTagClose(tag)"
                                                :color="tag.length > 4 ? 'cyan' : tag.length > 2 ? 'blue' : 'purple'"
                                                >{{ `${tag.slice(0, 8)}...` }}</a-tag
                                            >
                                        </a-tooltip>
                                        <a-tag
                                            v-else
                                            :key="tag"
                                            :closable="true"
                                            @close="handleTagClose(tag)"
                                            :color="tag.length > 4 ? 'cyan' : tag.length > 2 ? 'blue' : 'purple'"
                                            >{{ tag }}</a-tag
                                        >
                                    </template>
                                </vuedraggable>
                                <a-input
                                    v-if="tagInputVisible"
                                    ref="tagInput"
                                    type="text"
                                    size="small"
                                    :style="{ width: '78px' }"
                                    :value="tagInputValue"
                                    @change="handleInputChange"
                                    @blur="handleTagInputConfirm"
                                    @keyup.enter="handleTagInputConfirm"
                                />
                                <a-tag
                                    v-else
                                    @click="showTagInput"
                                    style="background: #fff; borderstyle: dashed"
                                    v-action:add
                                >
                                    <a-icon type="plus" />New Tag
                                </a-tag>
                            </div>
                        </div>
                    </a-card>
                </a-col>
                <a-col :md="24" :lg="17">
                    <Base-Setting></Base-Setting>
                </a-col>
            </a-row>
        </div>
    </page-header-wrapper>
</template>

<script>
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'
import { PageView, RouteView } from '@/layouts'
import BaseSetting from '../settings/Index'
import { changeUserLabel } from '@/api/login'
export default {
    components: {
        RouteView,
        PageView,
        BaseSetting,
    },
    data() {
        return {
            tagInputVisible: false,
            tagInputValue: '',
            user: {},
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        },
        address() {
            return this.user.address.join('')
        },
        jobs() {
            let sectorJobs = this.user.SectorJobs
            return sectorJobs[sectorJobs.length - 1]
        },
        department() {
            let department = JSON.parse(JSON.stringify(this.user.department))
            return department.join('-')
        },
        tags: {
            get() {
                return this.user.label
            },
            set() {},
        },
    },
    created() {
        this.user = this.userInfo
    },
    mounted() {},
    methods: {
        async handleTagClose(removeTag) {
            let tags = this.user.label.filter((x) => x != removeTag)
            let labelParams = {
                label: tags,
            }
            await changeUserLabel(labelParams).then((res) => {
                if (res.state == 1) {
                    let storeUser = Object.assign(this.user, labelParams)
                    this.$message.success(res.msg)
                    storage.set(USER_INFO, storeUser)
                } else {
                    this.$message.error(res.msg)
                }
            })
        },

        showTagInput() {
            this.tagInputVisible = true
            this.$nextTick(() => {
                this.$refs.tagInput.focus()
            })
        },

        handleInputChange(e) {
            this.tagInputValue = e.target.value
        },

        async handleTagInputConfirm() {
            const inputValue = this.tagInputValue
            let tags = this.tags || []
            if (inputValue && !tags.includes(inputValue)) {
                tags = [...tags, inputValue]
                let labelParams = {
                    label: tags,
                }
                await changeUserLabel(labelParams).then((res) => {
                    if (res.state == 1) {
                        let storeUser = Object.assign(this.user, labelParams)
                        this.$message.success(res.msg)
                        storage.set(USER_INFO, storeUser)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
            Object.assign(this, {
                tags,
                tagInputVisible: false,
                tagInputValue: '',
            })
        },
        // 标签拖拽
        async changeDra() {
            let labelParams = {
                label: this.tags,
            }
            await changeUserLabel(labelParams).then((res) => {
                if (res.state == 1) {
                    let storeUser = Object.assign(this.user, labelParams)
                    this.$message.success(res.msg)
                    storage.set(USER_INFO, storeUser)
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.page-header-wrapper-grid-content-main {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: 0.3s;

    .account-center-avatarHolder {
        text-align: center;
        margin-bottom: 24px;

        & > .avatar {
            margin: 0 auto;
            width: 104px;
            height: 104px;
            margin-bottom: 20px;
            border-radius: 50%;
            overflow: hidden;
            img {
                height: 100%;
                width: 100%;
            }
        }

        .username {
            color: rgba(0, 0, 0, 0.85);
            font-size: 20px;
            line-height: 28px;
            font-weight: 500;
            margin-bottom: 4px;
        }
    }

    .account-center-detail {
        p {
            margin-bottom: 8px;
            padding-left: 26px;
            position: relative;
        }

        i {
            position: absolute;
            height: 14px;
            width: 14px;
            left: 0;
            top: 4px;
            background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
        }

        .title {
            background-position: 0 0;
        }
        .group {
            background-position: 0 -22px;
        }
        .address {
            background-position: 0 -44px;
        }
    }

    .account-center-tags {
        .ant-tag {
            margin-bottom: 8px;
        }
    }

    .account-center-team {
        .members {
            a {
                display: block;
                margin: 12px 0;
                line-height: 24px;
                height: 24px;
                .member {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.65);
                    line-height: 24px;
                    max-width: 100px;
                    vertical-align: top;
                    margin-left: 12px;
                    transition: all 0.3s;
                    display: inline-block;
                }
                &:hover {
                    span {
                        color: #1890ff;
                    }
                }
            }
        }
    }

    .tagsTitle,
    .teamTitle {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 12px;
    }
}
.user-avatar {
    background: @primary-color;
    font-size: 36px !important;
}
</style>
