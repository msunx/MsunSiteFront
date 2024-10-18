import { Client } from '@notionhq/client';

export async function GET(request) {
    console.log('调用了')
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('验证没通过')
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    console.log('验证通过了')
    await createTask()
    return Response.json({ success: true });
}



async function createTask() {
    console.log('验证通过了xxxx')
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
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
                            "content": "测试MX"
                        }
                    }
                ]
            },
            "日期": {
                "date": {
                    "start": new Date().toISOString().split('T')[0] 
                }
            },
            "标签": {
                "select": {
                    "name": "工作"
                }
            }
        }
    });
}
