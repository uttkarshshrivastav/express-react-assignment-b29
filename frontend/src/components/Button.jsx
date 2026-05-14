const Button = ({ children, onClick, type = "button", className = "", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-transparent
        border border-white
        text-white
        px-6 py-2
        rounded
        hover:bg-white
        hover:text-black
        transition-colors
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-transparent
        disabled:hover:text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;