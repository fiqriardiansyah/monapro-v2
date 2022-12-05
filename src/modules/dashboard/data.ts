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
    [118710, 108710, 100078],
    [110775, 92397, 105439],
    [108710, 108710, 110719],
    [96983, 113913, 127210],
    [112197, 125387, 115330],
    [106427, 100384, 121816],
    [112107, 121225, 102301],
    [127474, 108788, 97048],
    [111743, 99246, 100800],
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
