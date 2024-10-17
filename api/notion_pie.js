import { Client } from '@notionhq/client';

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    try {
        const databaseId = id;
        const response = await notion.databases.query({ database_id: databaseId });
        const chartData = getChartData(response);
        return new Response(JSON.stringify(buildResult(chartData)));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Notion' }), { status: 500 });
    }
}

function getChartData(response) {
    const labels = [];
    const data = [];
    const results = response.results[0];

    for (const [key, value] of Object.entries(results.properties)) {
        if (key !== '综合' && key !== '日期' && value.type === 'number') {
            labels.push(key);
            if (value.number !== null) {
                data.push(value.number);
            } else {
                data.push(0);
            }
        }
    }

    return { labels, data };
}

function buildResult(response) {
    return {
        "success": true,
        "code": 200,
        "data": response,
    }
}
