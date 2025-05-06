<template>
    <div class='edit-popup'>
        <popup
            ref='popupRef'
            :title='popupTitle'
            :async='true'
            width='550px'
            @confirm='handleSubmit'
            @close='handleClose'
        >
            <el-form ref='formRef' :model='formData' label-width='90px' :rules='formRules'>
                <el-form-item label='名称' prop='name'>
                    <el-input v-model='formData.name' clearable placeholder='请输入名称' />
                </el-form-item>
                <el-form-item label='通知类型' prop='type'>
                    <el-select class='flex-1' v-model='formData.type' clearable placeholder='请选择通知类型'>
                        <el-option
                            v-for='(item, index) in dictData.notice_type'
                            :key='index'
                            :label='item.name'
                            :value='item.value'
                        />
                    </el-select>
                </el-form-item>

                <div v-if="formData.type=='dingtalk'">
                    <el-form-item label='access_token' prop='access_token'>
                        <el-input v-model='formData.dingtalk.access_token' clearable
                                  placeholder='access_token 机器人地址中的access_token值' />
                    </el-form-item>

                    <el-form-item label='secret' prop='secret'>
                        <el-input v-model='formData.dingtalk.secret' clearable placeholder='加签secret 非必填' />
                    </el-form-item>
                </div>


                <div v-if="formData.type=='qq'">
                    <el-form-item label='appid' prop='appid'>
                        <el-input v-model='formData.qq.appid' clearable placeholder='appid' />
                    </el-form-item>

                    <el-form-item label='token' prop='token'>
                        <el-input v-model='formData.qq.token' clearable placeholder='token' />
                    </el-form-item>

                </div>


                <div v-if="formData.type=='email'">

                    <el-form-item label='主机' prop='host'>
                        <el-input v-model='formData.smtp.host' clearable placeholder='host' />
                    </el-form-item>

                    <el-form-item label='端口' prop='port'>
                        <el-input v-model='formData.smtp.port' clearable placeholder='port' />
                    </el-form-item>

                    <el-form-item label='ssl' prop='encryption'>

                        <el-radio-group v-model="formData.smtp.encryption">
                            <el-radio value="ssl">是</el-radio>
                            <el-radio value="">否</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label='用户名' prop='username'>
                        <el-input v-model='formData.smtp.username' clearable placeholder='username' />
                    </el-form-item>

                    <el-form-item label='密码' prop='password'>
                        <el-input v-model='formData.smtp.password' clearable placeholder='password' />
                    </el-form-item>


                    <el-form-item label='发信人' prop='from'>
                        <el-input v-model='formData.smtp.from' clearable placeholder='from' />
                    </el-form-item>


                    <el-form-item label='收信人' prop='to'>
                        <el-input v-model='formData.smtp.to' clearable placeholder='to' />
                    </el-form-item>

                </div>

                <div v-if="formData.type=='wework'">
                    <el-form-item label='token' prop='token'>
                        <el-input v-model='formData.wework.token' clearable placeholder='token' />
                    </el-form-item>
                </div>


                <div v-if="formData.type=='webhook'">
                    <el-form-item label='url' prop='token'>
                        <el-input v-model='formData.webhook.url' clearable placeholder='URL地址 默认以get方式请求' />
                    </el-form-item>
                </div>


                <el-form-item label='是否启用' prop='status'>
                    <el-radio-group v-model='formData.status' placeholder='请选择是否启用'>
                        <el-radio
                            v-for='(item, index) in dictData.status'
                            :key='index'
                            :label='parseInt(item.value)'
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang='ts' setup name='stockNoticeEdit'>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiStockNoticeAdd, apiStockNoticeDetail, apiStockNoticeEdit } from '@/api/stock_notice'
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
    return mode.value == 'edit' ? '编辑通知' : '新增通知'
})

// 表单数据
const formData = reactive({
    id: '',
    name: '',
    type: '',
    status: 1,
    dingtalk:{
        access_token: '',
        secret: ''
    },
    qq: {
        appid: '',
     },
    smtp: {
        host: '',
        port: '',
        encryption: 'ssl',
        username: '',
        password: '',
        from: '',
        to: ''
    },
    wework: {
        token: ''
    },
    webhook: {
        url: ''
    },

})


// 表单验证
const formRules = reactive<any>({
    type: [{
        required: true,
        message: '请选择通知类型',
        trigger: ['blur']
    }],
    status: [{
        required: true,
        message: '请选择是否启用',
        trigger: ['blur']
    }]
})


// 获取详情
const setFormData = async (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]

        }

        formData[data.type] = data.recipient;

    }


}

const getDetail = async (row: Record<string, any>) => {
    const data = await apiStockNoticeDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate();

    const data = { ...formData }

    mode.value == 'edit'
        ? await apiStockNoticeEdit(data)
        : await apiStockNoticeAdd(data)
    popupRef.value?.close()
    emit('success')
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
