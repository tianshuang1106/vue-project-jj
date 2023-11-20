import request from '../utils/request'
import type * as AccountManage from "./types/accountManage"

// 账号基础数据
export const getBaseInfo = () => {
    return request<AccountManage.AccountRequestData>({
        url: '/gm_baseinfo',
        method: 'GET'
    })
}
// 账号查找
export const getAccountInfo = (params: { account?: string, date?: string, state?: string }) => {
    return request<AccountManage.AccountRequestData>({
        url: '/gm_query_account',
        method: 'GET',
        params
    })
}

// 新增账号
export const addAccount = (params: { account: string, pwd: string }) => {
    return request<AccountManage.AccountRequestData>({
        url: '/gm_add_account',
        method: 'POST',
        data: params
    })
}

// 修改账号
export const updateAccount = (params: any) => {
    return request<AccountManage.AccountRequestData>({
        url: '/gm_change_account',
        method: 'POST',
        data: params
    })
}

// 删除账号
export const delAccount = (params: { account: string }) => {
    return request<AccountManage.AccountRequestData>({
        url: '/gm_del_account',
        method: 'DELETE',
        data: params
    })
}