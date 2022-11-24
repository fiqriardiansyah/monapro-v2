import { RemainingBudgetType } from "./models";

export default {};

export const progressColor: { color: string; min: number }[] = [
    {
        color: "#52FF97",
        min: 65,
    },
    {
        color: "#FFBA52",
        min: 35,
    },
    {
        color: "#FF7E7E",
        min: 0,
    },
];

export const dataRevenueDefault = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"],
    datasets: [
        {
            label: "Unit 1",
            data: [100000, 120000, 154500, 193000, 123000, 144000, 210000, 160400, 189000, 164000, 200000, 180000],
            backgroundColor: ["rgb(197, 57, 180)"],
            borderColor: ["rgb(197, 57, 180)"],
            borderWidth: 1,
        },
        {
            label: "Unit 2",
            data: [120000, 100000, 130300, 123000, 127000, 134000, 210000, 180400, 139000, 154000, 180000, 145000],
            backgroundColor: ["rgb(239, 154, 83)"],
            borderColor: ["rgb(239, 154, 83)"],
            borderWidth: 1,
        },
        {
            label: "Unit 3",
            data: [150000, 135000, 123500, 123000, 143500, 145600, 276400, 112300, 113200, 121300, 234000, 146000],
            backgroundColor: ["rgb(70, 73, 255)"],
            borderColor: ["rgb(70, 73, 255)"],
            borderWidth: 1,
        },
    ],
    options: {
        responsive: true,
    },
};

export const dataRevenueDefault1 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"],
    datasets: [
        {
            label: "Unit 1",
            data: [100000, 120000, 154500, 193000, 123000, 144000, 210000, 160400, 189000, 164000, 200000, 180000],
            backgroundColor: ["rgb(197, 57, 180)"],
            borderColor: ["rgb(197, 57, 180)"],
            borderWidth: 1,
        },
    ],
    options: {
        responsive: true,
    },
};

export const mainBudget: RemainingBudgetType[] = [
    {
        budget: 400000000,
        percent: 73,
        title: "Total Pemakaian",
    },
    {
        budget: 230000000,
        percent: 33,
        title: "Sisa Pemakaian",
    },
];
