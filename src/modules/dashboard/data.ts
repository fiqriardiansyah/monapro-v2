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
        min: -1,
    },
];

export const randomRevenue = [
    [118710, 108710, 100078, 100323, 109127, 112439, 109442, 99192, 109316, 105439, 92397, 110775],
    [110775, 92397, 105439, 109316, 99192, 109442, 112439, 109127, 100323, 100078, 108710, 118710],
    [108710, 108710, 110710, 109127, 100323, 112439, 99192, 99192, 105439, 112439, 109127, 92397],
    [109127, 92397, 105439, 100078, 99192, 109442, 112439, 92397, 100323, 100078, 108710, 112439],
    [108710, 92397, 100078, 109127, 100323, 112439, 99192, 100323, 105439, 112439, 109127, 99192],
];

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
