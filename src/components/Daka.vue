<template>
    <div>
        <h1>{{ title }}</h1>
        <div class="container">
            <div class="grid" v-for="(week, weekIndex) in weeks" :key="weekIndex">
                <div class="grid-item" :class="[
                    day.isBlank ? 'blank' : '',
                    day.isToday ? 'today' : '',
                    day.isActive ? 'active' : ''
                ]" v-for="(day, dayIndex) in week" :key="dayIndex" @click="toggleDay(day)" :title="day.dateStr"
                    :date="day.dateStr">
                </div>
            </div>
        </div>
        <div>
            <p class="daka-count">打卡总天数: {{ dakaCount }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Daka',
    props: {
        title: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            kadaData: [],
            weeks: []
        };
    },
    computed: {
        dakaCount() {
            return this.kadaData.length;
        }
    },
    methods: {
        async fetchDakaData() {
            try {
                const response = await fetch(`http://${this.ip}:8728/notion/daka/get?title=${this.title}`);
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                const data = await response.json();
                this.kadaData = data.data;
            } catch (error) {
                console.error('获取打卡数据时出错:', error);
            }
        },
        getFirstDayOfYear() {
            const currentYear = new Date().getFullYear();
            return new Date(currentYear, 0, 1);
        },
        getLastDayOfYear() {
            const currentYear = new Date().getFullYear();
            const firstDayOfNextYear = new Date(currentYear + 1, 0, 1);
            const lastDayOfYear = new Date(firstDayOfNextYear);
            lastDayOfYear.setDate(lastDayOfYear.getDate() - 1);
            return lastDayOfYear;
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        areDatesEqual(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate();
        },
        async sendPostRequest(dateStr, isActive) {
            try {
                await fetch(`http://${this.ip}:8728/notion/daka/do`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date: dateStr,
                        title: this.title,
                        isActivate: isActive
                    }),
                });
            } catch (error) {
                console.error('发送请求时出错:', error);
            }
        },
        toggleDay(day) {
            if (day.isBlank) return;
            day.isActive = !day.isActive;
            this.sendPostRequest(day.dateStr, day.isActive);
        },
        renderWeeks() {
            const firstDay = this.getFirstDayOfYear();
            const lastDayOfYear = this.getLastDayOfYear();
            let currentDay = new Date(firstDay);
            const firstDayWeekday = currentDay.getDay(); // 0 (周日) 到 6 (周六)

            // 添加第一周的前导空白天
            let week = [];
            for (let i = 0; i < firstDayWeekday - 1; i++) {
                week.push({
                    dateStr: '',
                    isToday: false,
                    isActive: false,
                    isBlank: true
                });
            }

            while (currentDay <= lastDayOfYear) {
                const dateStr = this.formatDate(currentDay);
                const isToday = this.areDatesEqual(currentDay, new Date());
                const isActive = this.kadaData.includes(dateStr);
                week.push({
                    dateStr,
                    isToday,
                    isActive,
                    isBlank: false
                });

                if (week.length === 7) {
                    this.weeks.push([...week]);
                    week = [];
                }

                currentDay.setDate(currentDay.getDate() + 1);
            }

            // 添加最后一周的尾随空白天
            if (week.length > 0) {
                while (week.length < 7) {
                    week.push({
                        dateStr: '',
                        isToday: false,
                        isActive: false,
                        isBlank: true
                    });
                }
                this.weeks.push([...week]);
            }
        }
    },
    async mounted() {
        await this.fetchDakaData();
        this.renderWeeks();
    }
};
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    background-color: white;
    margin: 0;
    padding: 10px;
    /* 增加整体内边距 */
}

h1 {
    font-size: 1.7vw;
    /* 使用vw单位使标题大小随屏幕宽度变化 */
    margin-bottom: 1vw;
    margin-left: 2.9vw;
    font-weight: bold;
}

.daka-count {
    font-size: 1.4vw;
    /* 使用vw单位使文字大小随屏幕宽度变化 */
    font-weight: 400;
    margin-left: 2.9vw;
    margin-top: 1vw;
}

.container {
    display: flex;
    flex-wrap: wrap;
    /* 居中对齐 */
    margin: 0 2.8vw;
    /* 居中容器 */
    max-width: 100vw;
    /* 限制最大宽度 */
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(1.28vw, 1.5fr));
    /* 自适应列数 */
    gap: 0.25vw;
    /* 使用vw单位设置间隙 */
    margin: 0.25vw;
}

.grid-item {
    width: 100%;
    /* 宽度填满网格单元 */
    padding-bottom: 100%;
    /* 创建正方形 */
    background-color: #f1f3f5;
    border-radius: 20%;
    cursor: pointer;
    position: relative;
    /* 为绝对定位的子元素准备 */
}

.grid-item.active {
    background-color: #60a664;
}

.grid-item.today::after {
    content: '';
    position: absolute;
    bottom: 10%;
    left: 10%;
    right: 10%;
    height: 10%;
    background-color: #ec6d71;
    border-radius: 10px;
}

.grid-item.blank {
    background-color: transparent;
    /* 改为透明而不是白色 */
}
</style>