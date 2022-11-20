import { Progress, ProgressProps } from "antd";
import React from "react";
import { progressColor } from "../data";

type Props = ProgressProps;
const ProgressCustome = ({ percent, ...props }: Props) => {
    const color = progressColor.find((clr) => clr.min < (percent || 0));
    return <Progress {...props} percent={percent} strokeColor={{ "0%": color?.color || "", "100%": color?.color || "" }} />;
};

export default ProgressCustome;
