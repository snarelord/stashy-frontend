import * as React from "react";
import styles from "./button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, href, ...props }, ref) => {
    const variantClass = styles[variant] || styles.default;
    const sizeClass = styles[size] || styles.default;

    if (href && href.startsWith("mailto:")) {
      const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {};

      return (
        <a href={href} className={`${styles.button} ${variantClass} ${sizeClass} ${className || ""}`} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <button className={`${styles.button} ${variantClass} ${sizeClass} ${className || ""}`} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
