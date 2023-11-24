import request from '../utils/request'
import type { RequestData } from "./type"

// 账号基础数据
export const getBaseInfo = () => {
    return request<RequestData>({
        url: '/gm_baseinfo',
        method: 'GET'
    })
}
// 账号查找
export const getAccountInfo = (params: { account?: string, date?: string, state?: string }) => {
    return request<RequestData>({
        url: '/gm_query_account',
        method: 'GET',
        params
    })
}

// 新增账号
export const addAccount = (params: { account: string, pwd: string }) => {
    return request<RequestData>({
        url: '/gm_add_account',
        method: 'POST',
        data: params
    })
}

// 修改账号
export const updateAccount = (params: any) => {
    return request<RequestData>({
        url: '/gm_change_account',
        method: 'POST',
        data: params
    })
}

// 删除账号
export const delAccount = (params: { account: string }) => {
    return request<RequestData>({
        url: '/gm_del_account',
        method: 'DELETE',
        data: params
    })
}

// 批量删除账号
export const batchDelAccount = (params: { account?: string, date?: string, state?: string }) => {
    return request<RequestData>({
        url: '/gm_batch_delete_account',
        method: 'GET',
        params
    })
}

// 批量重置账号
export const batchResetAccount = (params: { account?: string, date?: string, state?: string }) => {
    return request<RequestData>({
        url: '/gm_batch_reset_account',
        method: 'GET',
        params
    })
}