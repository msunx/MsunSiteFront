export function GET(request) {
    console.log('调用了')
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('验证没通过')
        return new Response('Unauthorized', {
            status: 401,
        });
    }
    console.log('验证通过了')
    return Response.json({ success: true });
}