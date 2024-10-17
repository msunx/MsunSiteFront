<template>
    <div>
        <canvas id="pieChart"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// 注册所有的 Chart.js 组件
Chart.register(...registerables, ChartDataLabels);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const labelsParam = urlParams.get('labels');
const dataParam = urlParams.get('data');
// const title = urlParams.get('title');
const title = '测试';

const renderPieChart = async () => {
    // const databaseData = await getDatabase();
    const ctx = document.getElementById('pieChart').getContext('2d');
    // const labels = databaseData['labels'];
    const labels = ['牛牛', '富途', '微信', '支付宝', '抖音', '快手'];
    // const dataValues = databaseData['data'];
    const dataValues = [1, 2, 3, 4, 5, 6];

    const backgroundColors = labels.map((label,index) => getColorByHash(label,index));

    const data = {
        labels: labels,
        datasets: [{
            label: '比例',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: '#ffffff',
            borderWidth: 2
        }]
    };

    new Chart(ctx, {
        type: 'pie',
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
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 10 // 设置字体大小为10
                    },
                    formatter: (value, context) => {
                        return context.chart.data.labels[context.dataIndex];
                    }
                }
            }
        }
    });
};

const getColorByHash = (label,index) => {
    const colors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];
    return colors[index % colors.length];
};

const getDatabase = async () => {
    try {
        const response = await fetch(`/api/notion_pie_chart?id=${id}&labels=${labelsParam}&data=${dataParam}`);
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('获取数据时出错:', error);
    }
}

onMounted(() => {
    renderPieChart();
});
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
