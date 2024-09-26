export function GET(request) {
    const data =
    {
        "success": true,
        "code": 200,
        "data": {
            "x": [
                "2024-01-01",
                "2024-03-08",
                "2024-03-11",
                "2024-03-12",
                "2024-03-19",
                "2024-03-22",
                "2024-03-27",
                "2024-09-25",
                "2024-09-26"
            ],
            "y": [
                0,
                -3.77,
                -3.77,
                -4.13,
                -5.86,
                -7.95,
                -8.89,
                1.2,
                7.01
            ]
        },
        "appx": process.env.NOTION_API_KEY
    }
    return new Response(JSON.stringify(data));
}