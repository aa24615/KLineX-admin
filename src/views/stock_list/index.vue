<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item :label-width='labelWidth' label="股票代码" prop="code">
                    <el-input class="w-[160px]" v-model="queryParams.symbol" clearable placeholder="请输入代码" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="交易所" prop="exchange">
                    <el-select class="!w-[160px]" v-model="queryParams.exchange" clearable placeholder="请选择交易所">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="(item, index) in dictData.exchange"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="股票类型" prop="market">
                    <el-select class="!w-[160px]" v-model="queryParams.market" clearable placeholder="请选择股票类型">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="(item, index) in dictData.market"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="股票名称" prop="name">
                    <el-input class="w-[160px]" v-model="queryParams.name" clearable placeholder="请输入股票名称" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="当前价" prop="current">
                    <el-input class="w-[160px]" v-model="queryParams.current" clearable placeholder="请输入当前价" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="涨跌幅" prop="percent">
                    <el-input class="w-[160px]" v-model="queryParams.percent" clearable placeholder="请输入涨跌幅" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="成交量" prop="volume">
                    <el-input class="w-[160px]" v-model="queryParams.volume" clearable placeholder="请输入成交量" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="成交额" prop="amount">
                    <el-input class="w-[160px]" v-model="queryParams.amount" clearable placeholder="请输入成交额" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="换手率" prop="turnover_rate">
                    <el-input class="w-[160px]" v-model="queryParams.turnover_rate" clearable placeholder="请输入换手率" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="市盈率" prop="pe_ttm">
                    <el-input class="w-[160px]" v-model="queryParams.pe_ttm" clearable placeholder="请输入市盈率(TTM)" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="股息率" prop="dividend_yield">
                    <el-input class="w-[160px]" v-model="queryParams.dividend_yield" clearable placeholder="请输入股息率" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="总市值" prop="market_capital">
                    <el-input class="w-[160px]" v-model="queryParams.market_capital" clearable placeholder="请输入总市值" />
                </el-form-item>

                <el-form-item :label-width='labelWidth' label="流通市值" prop="float_market_capital">
                    <el-input class="w-[160px]" v-model="queryParams.float_market_capital" clearable placeholder="请输入流通市值" />
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <div>
                <el-table :data="pager.lists"
                          :default-sort="{ prop: queryParams.field, order: queryParams.order_by }"
                          @sort-change='sortChange'
                >
                    <el-table-column label="股票代码" width="80" prop="symbol" show-overflow-tooltip />

                    <el-table-column label="类型" width="60" prop="market">
                        <template #default="{ row }">
                            <dict-value :options="dictData.market" :value="row.market" />
                        </template>
                    </el-table-column>
                    <el-table-column label="股票名称" width="100" prop="name" show-overflow-tooltip />
                    <el-table-column label="涨跌额" width="90" sortable prop="chg" show-overflow-tooltip />
                    <el-table-column label="涨跌幅"  width="90" sortable prop="percent" show-overflow-tooltip />
                    <el-table-column label="当前价" width="90" sortable prop="current" show-overflow-tooltip />
                    <el-table-column label="成交量"  sortable prop="volume" show-overflow-tooltip />
                    <el-table-column label="成交额" sortable prop="amount" show-overflow-tooltip />
                    <el-table-column label="换手率" width="90" sortable prop="turnover_rate" show-overflow-tooltip />
                    <el-table-column label="市盈率" width="90" sortable prop="pe_ttm" show-overflow-tooltip />
                    <el-table-column label="股息率" width="90" sortable prop="dividend_yield" show-overflow-tooltip />
                    <el-table-column label="总市值" sortable prop="market_capital" show-overflow-tooltip />
<!--                    <el-table-column label="流通市值" sortable prop="float_market_capital" show-overflow-tooltip />-->
                    <el-table-column label="操作" width="80" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['stock_list/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                查看
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />

            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="stockListLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiStockListLists, apiStockListDelete } from '@/api/stock_list'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

const labelWidth = ref(80);

// 查询条件
const queryParams = reactive({
    code: '',
    exchange: '',
    market: '',
    name: '',
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
    updated_at: '',
    field:'percent',
    order_by:'desc'
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('exchange,market')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiStockListLists,
    params: queryParams
})

// 添加
const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

// 编辑
const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}

// 删除
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除？')
    await apiStockListDelete({ id })
    getLists()
}

const sortChange = (data: any) => {
    console.log(data);
    const { prop, order } = data

    queryParams.field = prop;
    queryParams.order_by = order;

    resetPage()
}

getLists()
</script>

