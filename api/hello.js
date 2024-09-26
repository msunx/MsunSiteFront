export function GET(request) {
    const data = {
        'data': 'hahaha'
    }
    return new Response(JSON.stringify(data));
}