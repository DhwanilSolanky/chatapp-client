import React from 'react'
import {Line, Doughnut} from "react-chartjs-2";
import {ArcElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip} from "chart.js";
import { orange, purpleLight, purple } from '../../constants/color';
import { getLast7Days } from '../../lib/features';

ChartJS.register(CategoryScale, Tooltip, LinearScale, LineElement, PointElement, Filler, ArcElement, Legend);


const lineChartsOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            }
        }
    }
};

const labels = getLast7Days();

const LineChart = ({value = []}) => {
    const data = {
        labels: labels,
        datasets: [
            {
                data: value,
                label: "Messages",
                fill: true,
                backgroundColor: purpleLight,
                borderColor: purple
            },
        ],
    };
  return (
    <Line data={data} options={lineChartsOptions} />
  )
};


const doughnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
    },
    cutout: 120,
}

const DoughnutChart = ({value=[], labels = []}) => {
    const data = {
        labels: labels,
        datasets: [
            {
                data: value,
                label: "Total Chats vs Group Chats",
                backgroundColor: [purpleLight, orange],
                borderColor: [purple, orange],
                offset: 20
            },
        ],
    };
    return (
      <Doughnut data={data} options={doughnutChartOptions} style={{zIndex: 10}}/>
    )
  }

export {LineChart, DoughnutChart};
