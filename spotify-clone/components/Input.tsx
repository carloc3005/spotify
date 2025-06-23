import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    className,
    type,
    disabled,
    ...props
}, ref ) => {
    return (
        <input 
            type={type} 
            className={twMerge(`
                flex w-full rounded-lg bg-neutral-700 border border-neutral-600 
                px-4 py-3 text-sm text-white
                file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white
                placeholder:text-neutral-400 
                disabled:cursor-not-allowed disabled:opacity-50 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                hover:border-neutral-500 transition-all duration-200
                ${type === 'file' ? 'file:mr-4 file:py-1 file:px-2 file:rounded file:bg-green-600 file:text-white file:cursor-pointer' : ''}
            `, className)} 
            disabled={disabled} 
            ref={ref} 
            {...props}
        />
    )
}
);

Input.displayName = "Input";
export default Input;