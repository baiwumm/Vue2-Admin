<template>
    <page-header-wrapper content="交互良好的信用卡表单">
        <div class="wrapper" id="dowebok">
            <div class="card-form">
                <div class="card-list">
                    <div class="card-item" :class="{ '-active': isCardFlipped }">
                        <div class="card-item__side -front">
                            <div
                                class="card-item__focus"
                                :class="{ '-active': focusElementStyle }"
                                :style="focusElementStyle"
                                ref="focusElement"
                            ></div>
                            <div class="card-item__cover">
                                <img src="../../assets/images/card.jpeg" class="card-item__bg" />
                            </div>

                            <div class="card-item__wrapper">
                                <div class="card-item__top">
                                    <img src="../../assets/images/chip.png" class="card-item__chip" />
                                    <div class="card-item__type">
                                        <transition name="slide-fade-up">
                                            <img
                                                :src="require(`@/assets/images/${getCardType}.png`)"
                                                v-if="getCardType"
                                                :key="getCardType"
                                                alt=""
                                                class="card-item__typeImg"
                                            />
                                        </transition>
                                    </div>
                                </div>
                                <label for="cardNumber" class="card-item__number" ref="cardNumber">
                                    <template v-if="getCardType === 'amex'">
                                        <span v-for="(n, $index) in amexCardMask" :key="$index">
                                            <transition name="slide-fade-up">
                                                <div
                                                    class="card-item__numberItem"
                                                    v-if="
                                                        $index > 4 &&
                                                        $index < 14 &&
                                                        cardNumber.length > $index &&
                                                        n.trim() !== ''
                                                    "
                                                >
                                                    *
                                                </div>
                                                <div
                                                    class="card-item__numberItem"
                                                    :class="{ '-active': n.trim() === '' }"
                                                    :key="$index"
                                                    v-else-if="cardNumber.length > $index"
                                                >
                                                    {{ cardNumber[$index] }}
                                                </div>
                                                <div
                                                    class="card-item__numberItem"
                                                    :class="{ '-active': n.trim() === '' }"
                                                    v-else
                                                    :key="$index + 1"
                                                >
                                                    {{ n }}
                                                </div>
                                            </transition>
                                        </span>
                                    </template>

                                    <template v-else>
                                        <span v-for="(n, $index) in otherCardMask" :key="$index">
                                            <transition name="slide-fade-up">
                                                <div
                                                    class="card-item__numberItem"
                                                    v-if="
                                                        $index > 4 &&
                                                        $index < 15 &&
                                                        cardNumber.length > $index &&
                                                        n.trim() !== ''
                                                    "
                                                >
                                                    *
                                                </div>
                                                <div
                                                    class="card-item__numberItem"
                                                    :class="{ '-active': n.trim() === '' }"
                                                    :key="$index"
                                                    v-else-if="cardNumber.length > $index"
                                                >
                                                    {{ cardNumber[$index] }}
                                                </div>
                                                <div
                                                    class="card-item__numberItem"
                                                    :class="{ '-active': n.trim() === '' }"
                                                    v-else
                                                    :key="$index + 1"
                                                >
                                                    {{ n }}
                                                </div>
                                            </transition>
                                        </span>
                                    </template>
                                </label>
                                <div class="card-item__content">
                                    <label for="cardName" class="card-item__info" ref="cardName">
                                        <div class="card-item__holder">Card Holder</div>
                                        <transition name="slide-fade-up">
                                            <div class="card-item__name" v-if="cardName.length" key="1">
                                                <transition-group name="slide-fade-right">
                                                    <template v-for="(n, $index) in cardName.replace(/\s\s+/g, ' ')">
                                                        <span
                                                            class="card-item__nameItem"
                                                            v-if="$index === $index"
                                                            :key="$index + 1"
                                                            >{{ n }}</span
                                                        >
                                                    </template>
                                                </transition-group>
                                            </div>
                                            <div class="card-item__name" v-else key="2">Full Name</div>
                                        </transition>
                                    </label>
                                    <div class="card-item__date" ref="cardDate">
                                        <label for="cardMonth" class="card-item__dateTitle">Expires</label>
                                        <label for="cardMonth" class="card-item__dateItem">
                                            <transition name="slide-fade-up">
                                                <span v-if="cardMonth" :key="cardMonth">{{ cardMonth }}</span>
                                                <span v-else key="2">MM</span>
                                            </transition>
                                        </label>
                                        /
                                        <label for="cardYear" class="card-item__dateItem">
                                            <transition name="slide-fade-up">
                                                <span v-if="cardYear" :key="cardYear">{{
                                                    String(cardYear).slice(2, 4) || cardYear
                                                }}</span>
                                                <span v-else key="2">YY</span>
                                            </transition>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-item__side -back">
                            <div class="card-item__cover">
                                <img src="../../assets/images/card.jpeg" class="card-item__bg" />
                            </div>
                            <div class="card-item__band"></div>
                            <div class="card-item__cvv">
                                <div class="card-item__cvvTitle">CVV</div>
                                <div class="card-item__cvvBand">
                                    <span v-for="(n, $index) in cardCvv" :key="$index"> * </span>
                                </div>
                                <div class="card-item__type">
                                    <img
                                        :src="require(`@/assets/images/${getCardType}.png`)"
                                        v-if="getCardType"
                                        class="card-item__typeImg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-form__inner">
                    <!-- 表单 -->
                    <a-form>
                        <!-- 信用卡号码 -->
                        <a-form-item label="信用卡号码">
                            <a-input
                                size="large"
                                id="cardNumber"
                                v-mask="generateCardNumberMask"
                                v-model="cardNumber"
                                @focus="focusInput('cardNumber')"
                                @blur="blurInput"
                            />
                        </a-form-item>
                        <!-- 持有者姓名 -->
                        <a-form-item label="持有者姓名">
                            <a-input
                                size="large"
                                id="cardName"
                                v-model="cardName"
                                @focus="focusInput('cardName')"
                                @blur="blurInput"
                                :maxLength="4"
                            />
                        </a-form-item>
                    </a-form>
                    <!-- 到期日 -->
                    <a-row :gutter="10">
                        <a-col :span="8">
                            <a-form-item label="到期月份">
                                <select
                                    class="card-input__input -select ant-select-selection"
                                    id="cardMonth"
                                    v-model="cardMonth"
                                    @focus="focusInput('cardDate')"
                                    @blur="blurInput"
                                    data-ref="cardDate"
                                >
                                    <option value="" disabled selected>月</option>
                                    <option
                                        v-bind:value="n < 10 ? '0' + n : n"
                                        v-for="n in 12"
                                        v-bind:disabled="n < minCardMonth"
                                        v-bind:key="n"
                                    >
                                        {{ n < 10 ? '0' + n : n }}
                                    </option>
                                </select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="到期年份">
                                <select
                                    class="card-input__input -select ant-select-selection"
                                    id="cardYear"
                                    v-model="cardYear"
                                    @focus="focusInput('cardDate')"
                                    @blur="blurInput"
                                >
                                    <option value="" disabled selected>年</option>
                                    <option
                                        v-bind:value="$index + minCardYear"
                                        v-for="(n, $index) in 12"
                                        v-bind:key="n"
                                    >
                                        {{ $index + minCardYear }}
                                    </option>
                                </select>
                            </a-form-item>
                        </a-col>
                        <!-- 校验码 -->
                        <a-col :span="8">
                            <a-form-item label="校验码">
                                <a-input
                                    size="large"
                                    id="cardCvv"
                                    v-mask="'####'"
                                    v-model="cardCvv"
                                    @focus="flipCard(true)"
                                    @blur="flipCard(false)"
                                    :maxLength="4"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-button
                        type="primary"
                        block
                        size="large"
                        style="color: #fff; height: 55px; font-size: 20px; margin-top: 15px"
                    >
                        提 交
                    </a-button>
                </div>
            </div>
        </div>
    </page-header-wrapper>
</template>

<script>
import { mask } from 'vue-the-mask'
export default {
    name: 'cardFrom',
    directives: { mask },
    data() {
        return {
            cardName: '',
            cardNumber: '',
            cardMonth: '',
            cardYear: '',
            cardCvv: '',
            minCardYear: new Date().getFullYear(),
            amexCardMask: '#### ###### #####',
            otherCardMask: '#### #### #### ####',
            isCardFlipped: false,
            focusElementStyle: null,
            isInputFocused: false,
        }
    },
    mounted() {
        document.getElementById('cardNumber').focus()
    },
    computed: {
        getCardType() {
            let number = this.cardNumber
            let re = new RegExp('^4')
            if (number.match(re) != null) return 'visa'

            re = new RegExp('^(34|37)')
            if (number.match(re) != null) return 'amex'

            re = new RegExp('^5[1-5]')
            if (number.match(re) != null) return 'mastercard'

            re = new RegExp('^6011')
            if (number.match(re) != null) return 'discover'

            re = new RegExp('^9792')
            if (number.match(re) != null) return 'troy'

            return 'visa'
        },
        generateCardNumberMask() {
            return this.getCardType === 'amex' ? this.amexCardMask : this.otherCardMask
        },
        minCardMonth() {
            if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1
            return 1
        },
    },
    watch: {
        cardYear() {
            if (this.cardMonth < this.minCardMonth) {
                this.cardMonth = ''
            }
        },
    },
    methods: {
        flipCard(status) {
            this.isCardFlipped = status
        },
        focusInput(e) {
            this.isInputFocused = true
            let target = this.$refs[e]
            this.focusElementStyle = {
                width: `${target.offsetWidth}px`,
                height: `${target.offsetHeight}px`,
                transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
            }
        },
        blurInput() {
            let vm = this
            setTimeout(() => {
                if (!vm.isInputFocused) {
                    vm.focusElementStyle = null
                }
            }, 500)
            vm.isInputFocused = false
        },
    },
}
</script>

<style lang="less" scoped>
@import url('./components/cardFrom.less');
.ant-form-item {
    margin-bottom: 10px;
}
</style>