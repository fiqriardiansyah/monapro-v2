import React, { useState } from "react";
import Utils from "utils";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";

const useBase64File = () => {
    const [isProcessLoad, setIsProcessLoad] = useState(false);
    const [base64, setBase64] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const processFile = async (file: File | null) => {
        if (!file) {
            setIsProcessLoad(false);
            setBase64(null);
            return;
        }
        setError(null);
        setIsProcessLoad(true);
        try {
            const bs64 = await Utils.toBase64(file);
            setBase64(bs64 as any);
            setIsProcessLoad(false);
        } catch (err) {
            setBase64(null);
            setIsProcessLoad(false);
            setError(DEFAULT_ERROR_MESSAGE);
        }
    };

    return {
        isProcessLoad,
        base64,
        error,
        processFile,
    };
};

export default useBase64File;
