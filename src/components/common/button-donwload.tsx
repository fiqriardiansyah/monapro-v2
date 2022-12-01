import { Button } from "antd";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import React from "react";
import { AiFillFile } from "react-icons/ai";

export type Props = {
    name: string;
    url: string;
    label?: string;
};

const ButtonDownload = ({ name, url, label }: Props) => {
    const onClickHandler = () => {
        const a = document.createElement("a") as HTMLAnchorElement;
        a.href = url;
        a.target = "_blank";
        a.setAttribute("download", name);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Button type="link" onClick={onClickHandler} icon={<AiFillFile className="mr-2" />} className="!flex !items-center text-gray-500">
            {label || "Download"}
        </Button>
    );
};

export default ButtonDownload;
