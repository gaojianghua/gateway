import { getConfig } from "@/utils";
// 从yaml中取配置
const { FEISHU_CONFIG } = getConfig()

export const APP_ID = FEISHU_CONFIG.FEISHU_APP_ID
export const APP_SECRET = FEISHU_CONFIG.FEISHU_APP_SECRET

"https://open.feishu.cn/open-apis/authen/v1/index?app_id=cli_a24f513f7f78900d&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauth"