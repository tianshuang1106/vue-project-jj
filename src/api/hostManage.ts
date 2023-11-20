import request from '../utils/request'
import type { RequestData } from "./type"

// 主机信息获取
export const getHostInfo = (uuid?: string) => {
    return request<RequestData>({
        url: '/gm_refresh_computer',
        method: 'GET',
        params: uuid
    })
}