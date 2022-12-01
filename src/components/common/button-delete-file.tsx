import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import ButtonDownload, { Props as ButtonDownloadProps } from "./button-donwload";

type Props = ButtonDownloadProps & {
    onClick: () => void;
};

const ButtonDeleteFile = ({ onClick, ...props }: Props) => {
    return (
        <div className="w-full items-center flex">
            <ButtonDownload {...props} />
            <AiFillCloseCircle onClick={onClick} className="cursor-pointer ml-4 text-xl text-gray-500 hover:text-red-400" />
        </div>
    );
};

export default ButtonDeleteFile;
