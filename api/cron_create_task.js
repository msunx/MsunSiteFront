export default function handler(req, res) {
    console.log('调用了')
    if (req.headers.get('authorization') !== `bearer ${process.env.cron_secret}`) {
        console.log('验证没通过')
        return res.status(401).end('unauthorized');
    }
    console.log('验证通过了')
    res.status(200).end('hello cron!');
}