import { Client } from '@notionhq/client';

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const x = url.searchParams.get('x');
    const y = url.searchParams.get('y');
    const auth = url.searchParams.get('auth');
    if (!check(auth, id)) {
        return new Response(JSON.stringify(errorResult()));
    }
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    try {
        const databaseId = id;
        const response = await notion.databases.query({ database_id: databaseId });
        const chartData = getChartData(response, x, y);
        return new Response(JSON.stringify(buildResult(chartData)));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Notion' }), { status: 500 });
    }
}

function getChartData(response, x, y) {
    const xData = [];
    const yData = [];
    const results = response.results;
    const sortedResults = results.sort((a, b) => {
        const aText = a.properties[x]?.title?.[0]?.plain_text || '';
        const bText = b.properties[x]?.title?.[0]?.plain_text || '';
        return aText.localeCompare(bText);
    });

    sortedResults.forEach(item => {
        xData.push(item.properties[x]?.title?.[0]?.plain_text || '');
        if (item.properties[y]?.number !== undefined) {
            yData.push(item.properties[y].number);
        } else if (item.properties[y]?.formula?.number !== undefined) {
            yData.push(item.properties[y].formula.number);
        } else {
            yData.push(0);
        }
    });

    return { x: xData, y: yData };
}

function check(auth, id) {
    if (auth === process.env.AUTH_SECRET && id !== null) {
        return true;
    } else {
        return false;
    }
}

function buildResult(response) {
    return {
        "success": true,
        "code": 200,
        "data": response,
    }
}

function errorResult() {
    return {
        "success": false,
        "code": 404
    }
}