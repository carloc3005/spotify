"use client";

import { BounceLoader } from "react-spinners";

const Loading = () => {
    return (
        <div className="h-full items-center justify-center">
            <BounceLoader color = "#22c54e" size={40} /> 
        </div>
    );
}

export default Loading;