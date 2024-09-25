<template>
    <div>
        <canvas id="lineChart"></canvas>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { Chart, registerables } from 'chart.js';

    // 注册所有的 Chart.js 组件
    Chart.register(...registerables);
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const x = urlParams.get('x');
    const y = urlParams.get('y');
    const title = urlParams.get('title');
    const ip = urlParams.get('ip');

    const renderChart = async () => {
        const databaseData = await getDatabase();
        const ctx = document.getElementById('lineChart').getContext('2d');
        const labels = databaseData['x'];

        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, getColorByHash(title));
        gradient.addColorStop(1, getColorByHash(title).replace(/0\.5/, '0'));

        const data = {
            labels: labels,
            datasets: [{
                label: '值',
                data: databaseData['y'],
                fill: true,
                borderColor: getColorByHash(title),
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.2
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    };

    const getColorByHash = (title) => {
        const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
        ];
        return colors[hash % colors.length];
    };

    const getDatabase = async () => {
        try {
            const response = await fetch(`http://${ip}:8728/notion/chart/database/get?id=${id}&x=${x}&y=${y}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    };

    onMounted(() => {
        renderChart();
    });
</script>

<style scoped>
    /* 可以在这里添加样式 */
</style>