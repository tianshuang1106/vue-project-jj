import request from '../utils/request'
import type { RequestData } from "./type"

// 全部主机信息获取
export const getHostInfo = () => {
    return request<RequestData>({
        url: '/gm_refresh_host',
        method: 'GET'
    })
}

// 查询主机信息
export const getCurrentHost = (uid?: string) => {
    return request<RequestData>({
        url: '/gm_query_host',
        method: 'GET',
        params: { uid }
    })
}

// 新建主机
export const addHost = () => {
    return request<RequestData>({
        url: '/gm_create_host',
        method: 'GET'
    })
}

// 修改主机
export const updateHost = (params: any) => {
    return request<RequestData>({
        url: '/gm_modify_host',
        method: 'POST',
        data: params
    })
}
