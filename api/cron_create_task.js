import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(request) {
    console.log('开始创建任务')
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('权限校验失败')
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    await createTask()
    return Response.json({ success: true });
}

async function createTask() {
    const config = await getConfig()
    for (const item of config) {
        if (checkNeedCreateTask(item)) {
            await doCreateTask(item.data.title, item.data.tag)
        } else {
            console.log('没有需要创建的任务')
        }
    }
}

function checkNeedCreateTask(config) {
    console.log('config', config)
    if (config.type === 'day') {
        const now = new Date()
        now.setHours(now.getHours() + 12);
        const nowStr = (now.getMonth() + 1) + '-' + now.getDate()
        console.log('nowStr', nowStr)
        console.log('config.value', config.value)
        return config.value === nowStr
    }
    return false
}

async function doCreateTask(title, tag) {
    console.log('执行创建任务')
    const now = new Date();
    now.setHours(now.getHours() + 12);
    const response = await notion.pages.create({
        "icon": {
            "type": "emoji",
            "emoji": "🥬"
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
                    "name": tag
                }
            }
        }
    });
}

async function getConfig() {
    const blockId = process.env.CRON_TASK_CONFIG;
    const response = await notion.blocks.retrieve({
        block_id: blockId,
    });
    console.log(response.code.rich_text[0].plain_text);
    return JSON.parse(response.code.rich_text[0].plain_text)
}
