<template>
    <div class="countdown-container">
        <h2 class="countdown-title">{{ title }}</h2>
        <div class="countdown-days">
            <span class="days-count">{{ days }}</span>
            <span class="days-label">Days</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Countdown',
    data() {
        return {
            title: '',
            expiryDate: '',
            timer: null,
            daysLeft: 0
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
            this.title = params.get('title') || '倒计时';
            this.expiryDate = params.get('expiry') || this.getDefaultExpiryDate();
        },
        getDefaultExpiryDate() {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 10); // 默认10天后
            return currentDate.toISOString();
        },
        calculateDaysLeft() {
            const now = new Date();
            const expiry = new Date(this.expiryDate);
            const difference = expiry - now;

            if (difference > 0) {
                const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
                this.daysLeft = days;
            } else {
                this.daysLeft = 0;
                clearInterval(this.timer);
            }
        }
    },
    mounted() {
        this.getUrlParams();
        this.calculateDaysLeft();
        this.timer = setInterval(this.calculateDaysLeft, 86400000); // 每天更新一次
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
};
</script>

<style scoped>
.countdown-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 30px 30px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin: 10vw;
}


.countdown-title {
    font-size: 1.5em;
    /* 调小标题字体 */
    margin-bottom: 12px;
}

.countdown-days {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 30px;
    border-radius: 45px;
    backdrop-filter: blur(10px);
}

.days-count {
    font-size: 4em;
    /* 调大天数字体 */
    font-weight: bold;
    margin-right: 10px;
    transition: color 0.3s ease;
    color: #ffdd57;
}

.days-label {
    font-size: 0.8em;
    /* 调小标签字体 */
    margin-top: 2.4em;
}


@media (max-width: 600px) {
    .countdown-title {
        font-size: 1.5em;
        /* 调小标题字体 */
    }

    .days-count {
        font-size: 3em;
        /* 调大天数字体 */
    }

    .days-label {
        font-size: 0.8em;
        /* 调小标签字体 */
    }
}
</style>