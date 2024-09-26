import { Client } from '@notionhq/client';

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const title = url.searchParams.get('title');
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    try {
        const databaseId = id;
        const response = await notion.databases.query({ database_id: databaseId });
        const dakaData = getDakaData(response, title);
        return new Response(JSON.stringify(buildResult(dakaData)));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Notion' }), { status: 500 });
    }
}

function getDakaData(response, title) {
    const results = response.results;
    for (const result of results) {
        if (result.properties['名称'].title[0].plain_text === title) {
            return result.properties['记录'].rich_text[0].plain_text.split(',');
        }
    }
}

function buildResult(response) {
    return {
        "success": true,
        "code": 200,
        "data": response,
    }
}