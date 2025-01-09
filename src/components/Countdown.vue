<template>
    <div class="countdown-container">
        <p class="countdown-title">{{ previousSolarTerm }}<span class="countdown-title-sub">| 第<span class="highlight">一</span>个节气计划</span></p>
        <div class="countdown-days">
            <span class="days-count">{{ daysUntilNextTerm }}</span>
            <span class="days-label">Days</span>
        </div>
        <div class="countdown-content">
            <ul>
                <li>
                    <span class="countdown-content-item">不打游戏</span>
                </li>
                <li>
                    <span class="countdown-content-item">娱乐性APP限制</span>
                </li>
                <li>
                    <span class="countdown-content-item">每天运动到Peak达标</span>
                </li>
                <li>
                    <span class="countdown-content-item">今日事今日毕</span>
                </li>
                <li>
                    <span class="countdown-content-item">有意识不抠</span>
                </li>
            </ul>
        </div>
        <div class="countdown-topic">
            <div>多巴胺禁断</div>
            <div class="countdown-topic-date">{{ currentDate }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Countdown',
    data() {
        return {
            // title: '',
            previousSolarTerm: '',
            nextSolarTerm: '',
            daysUntilNextTerm: 0,
            currentDate: ''
        };
    },
    computed: {
        days() {
            return this.daysLeft;
        }
    },
    methods: {
        getUrlParams() {
            const params = new URLSearchParams(window.location.search);
            //this.title = params.get('title') || '倒计时';
        },
        getJq() {
            const solarTerms = [
                { name: '立春', month: 2, day: 4 },
                { name: '雨水', month: 2, day: 19 },
                { name: '惊蛰', month: 3, day: 6 },
                { name: '春分', month: 3, day: 21 },
                { name: '清明', month: 4, day: 5 },
                { name: '谷雨', month: 4, day: 20 },
                { name: '立夏', month: 5, day: 6 },
                { name: '小满', month: 5, day: 21 },
                { name: '芒种', month: 6, day: 6 },
                { name: '夏至', month: 6, day: 21 },
                { name: '小暑', month: 7, day: 7 },
                { name: '大暑', month: 7, day: 23 },
                { name: '立秋', month: 8, day: 8 },
                { name: '处暑', month: 8, day: 23 },
                { name: '白露', month: 9, day: 8 },
                { name: '秋分', month: 9, day: 23 },
                { name: '寒露', month: 10, day: 8 },
                { name: '霜降', month: 10, day: 23 },
                { name: '立冬', month: 11, day: 7 },
                { name: '小雪', month: 11, day: 22 },
                { name: '大雪', month: 12, day: 7 },
                { name: '冬至', month: 12, day: 21 },
                { name: '小寒', month: 1, day: 5 },
                { name: '大寒', month: 1, day: 20 }
            ];

            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1; // 月份从0开始
            const currentDate = today.getDate();

            // 构建当前年份的节气日期
            const termsThisYear = solarTerms.map(term => {
                return {
                    name: term.name,
                    date: new Date(currentYear, term.month - 1, term.day)
                };
            });

            // 如果当前日期在大寒之后，添加下一年的立春
            if (currentMonth === 1 && currentDate > 20) {
                termsThisYear.push({
                    name: '立春',
                    date: new Date(currentYear + 1, 1 - 1, 4)
                });
            }

            // 排序节气日期
            termsThisYear.sort((a, b) => a.date - b.date);

            let previousTerm = null;
            let nextTerm = null;

            for (let i = 0; i < termsThisYear.length; i++) {
                if (today < termsThisYear[i].date) {
                    nextTerm = termsThisYear[i];
                    previousTerm = termsThisYear[i - 1] || termsThisYear[termsThisYear.length - 1];
                    break;
                }
            }

            // 如果没有找到下一个节气，取最后一个和第一个
            if (!nextTerm) {
                nextTerm = termsThisYear[0];
                previousTerm = termsThisYear[termsThisYear.length - 1];
            }

            // 计算距离下一个节气的天数
            const oneDay = 1000 * 60 * 60 * 24;
            const daysUntilNextTerm = Math.ceil((nextTerm.date - today) / oneDay);

            //console.log(previousTerm.name, nextTerm.name, daysUntilNextTerm);
            this.previousSolarTerm = previousTerm.name;
            this.daysUntilNextTerm = daysUntilNextTerm;
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        }
    },
    mounted() {
        this.getUrlParams();
        this.getJq();
        this.currentDate = this.formatDate(new Date());
    },
};
</script>

<style scoped>
.countdown-container {
    width: 100vw;
    height: 100vw;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 20px 30px 30px 30px;
    background: url('/countdown-bg.jpg') no-repeat center center;
    background-size: cover;
    border-radius: 20px;
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin: 0;
}


.countdown-title {
    font-size: 11vw;
    margin-bottom: 0;
    padding: 0;
    text-align: left;
    font-weight: bold;
}

.countdown-title-sub {
    font-size: 2.8vw;
    margin-left: 1vw;
    color: #d9dace;
}

.countdown-days {
    display: flex;
    align-items: flex-end;
    /* 修改这里 */
}

.days-count {
    font-size: 6vw;
    font-weight: bold;
    margin-right: 1vw;
    transition: color 0.3s ease;
    color: #ffdd57;
}

.days-label {
    font-size: 3vw;
    font-weight: bold;
    margin-bottom: 1.8vw;
}

.countdown-content {
    display: flex;
    align-items: flex-start;
    margin-left: 2.8vw;
    font-size: 3vw;
    /* 确保内容顶部对齐 */
}

.countdown-content ul {
    padding-left: 0;
}

.countdown-topic {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 4vw;
    font-weight: bold;
    color: #ffffff;
}

.countdown-topic-date {
    font-size: 2.5vw;
    margin-left: 5.5vw;
}

.countdown-title-sub .highlight {
    color: #ffdd57;
}
</style>