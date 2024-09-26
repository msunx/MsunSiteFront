import { Client } from '@notionhq/client';
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request) {
    const { id, title, date, isActivate } = await request.json();
    console.log(date, isActivate);

    try {
        const databaseId = id;
        const response = await notion.databases.query({ database_id: databaseId });
        const dakaData = getDakaData(response, title);
        getNewRecord(dakaData.record, date, isActivate);
        await updateDakaData(dakaData.id, dakaData.record);
        return new Response(JSON.stringify(buildResult(true)));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Notion' }), { status: 500 });
    }
}

function getDakaData(response, title) {
    const results = response.results;
    for (const result of results) {
        if (result.properties['名称'].title[0].plain_text === title) {
            const data = {
                "id": result.id,
                "record": result.properties['记录'].rich_text
            }
            return data;
        }
    }
}

function getNewRecord(record, date, isActivate) {
    const oldRecord = record[0].plain_text.split(',');
    if (isActivate) {
        if (!oldRecord.includes(date)) {
            oldRecord.push(date);
        }
    } else {
        const index = oldRecord.indexOf(date);
        if (index !== -1) {
            oldRecord.splice(index, 1);
        }
    }
    const newRecord = oldRecord.join(',');
    record[0].plain_text = newRecord;
    record[0].text.content = newRecord;
}

async function updateDakaData(id, record) {
    await notion.pages.update({
        page_id: id,
        properties: {
            '记录': {
                rich_text: record
            }
        },
    });
}

function buildResult(response) {
    return {
        "success": true,
        "code": 200,
        "data": response,
    }
}