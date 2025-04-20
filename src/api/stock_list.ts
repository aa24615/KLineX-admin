import request from '@/utils/request'

// 实时分析列表
export function apiStockListLists(params: any) {
    return request.get({ url: '/stock_list/lists', params })
}

// 添加实时分析
export function apiStockListAdd(params: any) {
    return request.post({ url: '/stock_list/add', params })
}

// 编辑实时分析
export function apiStockListEdit(params: any) {
    return request.post({ url: '/stock_list/edit', params })
}

// 删除实时分析
export function apiStockListDelete(params: any) {
    return request.post({ url: '/stock_list/delete', params })
}

// 实时分析详情
export function apiStockListDetail(params: any) {
    return request.get({ url: '/stock_list/detail', params })
}