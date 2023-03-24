import "styles/ui/Button.scss";
import React, { FC, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  style,
  width,
  ...rest
}) => (
  <button
    {...rest}
    style={{ width, ...style }}
    className={`primary-button ${className}`}
  >
    {children}
  </button>
);
