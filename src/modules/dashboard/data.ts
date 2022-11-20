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
            label: "Statistik",
            data: [100000, 120000, 154500, 193000, 123000, 144000, 210000, 160400, 189000, 164000, 200000, 180000],
            backgroundColor: [],
            borderColor: [],
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
