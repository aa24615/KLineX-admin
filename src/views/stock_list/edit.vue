<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="800px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="150px" :rules="formRules">

                <el-row :gutter="20">
                    <el-col :span="12">

                        <el-form-item label="股票代码" prop="symbol">
                            <el-input v-model="formData.symbol" clearable placeholder="请输入股票代码" />
                        </el-form-item>
                        <el-form-item label="代码" prop="code">
                            <el-input v-model="formData.code" clearable placeholder="请输入代码" />
                        </el-form-item>

                        <el-form-item label="股票类型" prop="market">
                            <el-select class="flex-1" v-model="formData.market" clearable placeholder="请选择股票类型">
                                <el-option
                                    v-for="(item, index) in dictData.market"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="交易所" prop="exchange">
                            <el-select class="flex-1" v-model="formData.exchange" clearable placeholder="请选择交易所">
                                <el-option
                                    v-for="(item, index) in dictData.exchange"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="股票名称" prop="name">
                            <el-input v-model="formData.name" clearable placeholder="请输入股票名称" />
                        </el-form-item>

                        <el-form-item label="涨跌额" prop="chg">
                            <el-input v-model="formData.chg" clearable placeholder="请输入涨跌额" />
                        </el-form-item>
                        <el-form-item label="当前价" prop="current">
                            <el-input v-model="formData.current" clearable placeholder="请输入当前价" />
                        </el-form-item>
                        <el-form-item label="年初至今-涨跌幅" prop="current_year_percent">
                            <el-input v-model="formData.current_year_percent" clearable placeholder="请输入年初至今-涨跌幅" />
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="涨跌幅" prop="percent">
                            <el-input v-model="formData.percent" clearable placeholder="请输入涨跌幅" />
                        </el-form-item>
                        <el-form-item label="成交量" prop="volume">
                            <el-input v-model="formData.volume" clearable placeholder="请输入成交量" />
                        </el-form-item>
                        <el-form-item label="成交额" prop="amount">
                            <el-input v-model="formData.amount" clearable placeholder="请输入成交额" />
                        </el-form-item>
                        <el-form-item label="换手率" prop="turnover_rate">
                            <el-input v-model="formData.turnover_rate" clearable placeholder="请输入换手率" />
                        </el-form-item>
                        <el-form-item label="市盈率(TTM)" prop="pe_ttm">
                            <el-input v-model="formData.pe_ttm" clearable placeholder="请输入市盈率(TTM)" />
                        </el-form-item>
                        <el-form-item label="股息率" prop="dividend_yield">
                            <el-input v-model="formData.dividend_yield" clearable placeholder="请输入股息率" />
                        </el-form-item>
                        <el-form-item label="总市值" prop="market_capital">
                            <el-input v-model="formData.market_capital" clearable placeholder="请输入总市值" />
                        </el-form-item>
                        <el-form-item label="流通市值" prop="float_market_capital">
                            <el-input v-model="formData.float_market_capital" clearable placeholder="请输入流通市值" />
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="stockListEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiStockListAdd, apiStockListEdit, apiStockListDetail } from '@/api/stock_list'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')


// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '查看股票' : '查看股票'
})

// 表单数据
const formData = reactive({
    id: '',
    symbol: '',
    code: '',
    exchange: '',
    market: '',
    name: '',
    chg: '',
    current: '',
    current_year_percent: '',
    percent: '',
    volume: '',
    amount: '',
    turnover_rate: '',
    pe_ttm: '',
    dividend_yield: '',
    market_capital: '',
    float_market_capital: '',
})


// 表单验证
const formRules = reactive<any>({

})


// 获取详情
const setFormData = async (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }


}

const getDetail = async (row: Record<string, any>) => {
    const data = await apiStockListDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    // await formRef.value?.validate()
    // const data = { ...formData,  }
    // mode.value == 'edit'
    //     ? await apiStockListEdit(data)
    //     : await apiStockListAdd(data)
    // popupRef.value?.close()
    // emit('success')
    emit('close')
}

//打开弹窗
const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

// 关闭回调
const handleClose = () => {
    emit('close')
}



defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
