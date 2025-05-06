import request from '@/utils/request'

// 通知列表
export function apiStockNoticeLists(params: any) {
    return request.get({ url: '/stock_notice/lists', params })
}

// 添加通知
export function apiStockNoticeAdd(params: any) {
    return request.post({ url: '/stock_notice/add', params })
}

// 编辑通知
export function apiStockNoticeEdit(params: any) {
    return request.post({ url: '/stock_notice/edit', params })
}

// 删除通知
export function apiStockNoticeDelete(params: any) {
    return request.post({ url: '/stock_notice/delete', params })
}

// 通知详情
export function apiStockNoticeDetail(params: any) {
    return request.get({ url: '/stock_notice/detail', params })
}