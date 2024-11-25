<template>
  <page-header-wrapper>
    <a-card>
      <a-tabs>
        <a-tab-pane key="docx" :tab="I18nVueOffice('docx')">
          <vue-office-docx />
        </a-tab-pane>
        <a-tab-pane key="excel" :tab="I18nVueOffice('excel')">
          <vue-office-excel />
        </a-tab-pane>
        <a-tab-pane key="pdf" :tab="I18nVueOffice('pdf')">
          <vue-office-pdf />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { I18nVueOffice } from '@/constant/i18n'

import VueOfficeDocx from './components/vue-office-docx'
import VueOfficeExcel from './components/vue-office-excel'
import VueOfficePdf from './components/vue-office-pdf'
export default {
  name: 'VueOffice',
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf
  },
  data() {
    return {
      I18nVueOffice
    }
  }
}
</script>
