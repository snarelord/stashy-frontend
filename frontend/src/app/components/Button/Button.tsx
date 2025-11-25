import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  colourScheme: "black" | "purple";
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ text, colourScheme, onClick, disabled }: ButtonProps) {
  const buttonStyle = colourScheme === "black" ? styles.blackButton : styles.purpleButton;

  return (
    <button className={buttonStyle} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
