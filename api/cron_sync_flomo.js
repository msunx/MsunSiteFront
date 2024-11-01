import axios from 'axios';
import crypto from 'crypto';
import { convert as htmlToTextConvert } from 'html-to-text';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const FLOMO_DOMAIN = "https://flomoapp.com";
const MEMO_LIST_URL = `${FLOMO_DOMAIN}/api/v1/memo/updated/`;

const HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Origin": "https://v.flomoapp.com",
    "Priority": "u=1, i",
    "Referer": "https://v.flomoapp.com/",
    "Sec-CH-UA": `"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"`,
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": `"macOS"`,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
};

function _ksort(obj) {
    return Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}

function getSign(params) {
    params = _ksort(params);
    let t = "";
    for (let key in params) {
        const value = params[key];
        if (value !== undefined && (value || value === 0)) {
            if (Array.isArray(value)) {
                value.sort((a, b) => (a || "").localeCompare(b || ""));
                value.forEach(item => {
                    t += `${key}[]=${item}&`;
                });
            } else {
                t += `${key}=${value}&`;
            }
        }
    }
    t = t.slice(0, -1);
    return c(t + "dbbc3dd73364b4084c3a69346e0ce2b2");
}

function c(t) {
    return crypto.createHash('md5').update(t, 'utf8').digest('hex');
}

function str_to_timestamp(str) {
    return Math.floor(new Date(str).getTime() / 1000);
}

function addDoneTagToParagraphs(content) {
    return content.replace(/<p>/, '<p> #已同步 ');
}

async function update_memo(user_authorization, memo) {
    const current_timestamp = Math.floor(Date.now() / 1000);
    const params = {
        "content": addDoneTagToParagraphs(memo.content),
        "created_at": str_to_timestamp(memo.created_at),
        "local_updated_at": str_to_timestamp(memo.updated_at),
        "file_ids": [],
        "tz": "8:0",
        "timestamp": current_timestamp,
        "api_key": "flomo_web",
        "app_version": "4.0",
        "platform": "web",
        "webp": "1"
    }

    params["sign"] = getSign(params);
    const headers = { ...HEADERS, "Authorization": `Bearer ${user_authorization}`, "Content-Type": "application/json" };
    try {
        const response = await axios.put(`${FLOMO_DOMAIN}/api/v1/memo/${memo.slug}`, params, { headers });
        if (response.status !== 200) {
            console.error("更新memo失败:", response.data);
            return;
        }
        const response_json = response.data;
        if (response_json.code !== 0) {
            console.error("更新memo失败:", response_json.message);
            return;
        }
        console.log('更新memo成功')
        return response_json.data;
    } catch (error) {
        console.error("更新memo失败:", error);
    }
}


function getYesterdayMidnightTimestamp() {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    now.setHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
}

async function get_memo_list(user_authorization, latest_updated_at = "0") {
    const current_timestamp = Math.floor(Date.now() / 1000);
    latest_updated_at = getYesterdayMidnightTimestamp().toString();

    const params = {
        "limit": "200",
        "latest_updated_at": latest_updated_at,
        "tz": "8:0",
        "timestamp": current_timestamp.toString(),
        "api_key": "flomo_web",
        "app_version": "4.0",
        "platform": "web",
        "webp": "1",
    };

    params["sign"] = getSign(params);
    const headers = { ...HEADERS, "Authorization": `Bearer ${user_authorization}` };
    try {
        const response = await axios.get(MEMO_LIST_URL, { headers, params });
        if (response.status !== 200) {
            console.error("get_memo_list http error:", response.data);
            return;
        }
        const response_json = response.data;
        if (response_json.code !== 0) {
            console.error("get_memo_list business error:", response_json.message);
            return;
        }
        return response_json.data;
    } catch (error) {
        console.error("get_memo_list request error:", error);
    }
}

async function format_memo_list(authorization, memo_list) {
    for (const memo of memo_list) {
        if (memo.deleted_at !== null) continue;
        if (memo.tags.includes('已同步')) continue;
        if (memo.tags.includes('TODO')) {
            await sync_todo_to_notion(memo);
            await update_memo(authorization, memo);
        }
        if (memo.tags.includes('灵感')) {
            await sync_idea_to_notion(memo);
            await update_memo(authorization, memo);
        }
    }
}

function removeHashtags(input) {
    return input.replace(/#\S+\s*/g, '').trim();
}

async function sync_todo_to_notion(memo) {
    const now = new Date()
    now.setHours(now.getHours() + 12);
    const content = htmlToTextConvert(memo.content);
    const firstLine = content.split('\n')[0];
    const title = removeHashtags(firstLine);
    const otherContent = content.slice(firstLine.length).trim();
    const params = {
        "icon": {
            "type": "emoji",
            "emoji": "🍓"
        },
        "parent": {
            "type": "database_id",
            "database_id": process.env.CRON_TASK_DATABASE
        },
        "properties": {
            "事项": {
                "title": [
                    {
                        "text": {
                            "content": title
                        }
                    }
                ]
            },
            "日期": {
                "date": {
                    "start": now.toISOString().split('T')[0]
                }
            },
            "标签": {
                "select": {
                    "name": "flomo"
                }
            }
        }
    }
    if (otherContent != '') {
        params['children'] = [
            {
                "object": "block",
                "paragraph": {
                    "rich_text": [
                        {
                            "text": {
                                "content": otherContent
                            }
                        }
                    ]
                }
            }
        ]
    }
    await notion.pages.create(params);
}


async function sync_idea_to_notion(memo) {
    const now = new Date()
    now.setHours(now.getHours() + 12);
    const content = htmlToTextConvert(memo.content);
    const firstLine = content.split('\n')[0];
    const title = removeHashtags(firstLine);
    const otherContent = content.slice(firstLine.length).trim();
    const params = {
        "icon": {
            "type": "emoji",
            "emoji": "🫐"
        },
        "parent": {
            "type": "database_id",
            "database_id": process.env.CRON_IDEA_DATABASE
        },
        "properties": {
            "灵感": {
                "title": [
                    {
                        "text": {
                            "content": title
                        }
                    }
                ]
            },
            "日期": {
                "date": {
                    "start": now.toISOString().split('T')[0]
                }
            },
            "标签": {
                "select": {
                    "name": "flomo"
                }
            }
        }
    }
    if (otherContent != '') {
        params['children'] = [
            {
                "object": "block",
                "paragraph": {
                    "rich_text": [
                        {
                            "text": {
                                "content": otherContent
                            }
                        }
                    ]
                }
            }
        ]
    }
    await notion.pages.create(params);
}

export async function GET(request) {
    console.log('开始同步flomo')
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('权限校验失败')
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    const authorization = `Bearer ${process.env.FLOMO_AUTH_KEY}`;
    const memo_list = await get_memo_list(authorization)
    await format_memo_list(authorization, memo_list);
    return Response.json({ success: true });
}