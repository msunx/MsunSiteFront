export default function handler(req, res) {
    console.log('调用了')
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('验证没通过')
        return res.status(401).end('Unauthorized');
    }
    console.log('验证通过了')
    res.status(200).end('Hello Cron!');
}