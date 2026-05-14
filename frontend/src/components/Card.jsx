const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-card-bg border border-card-border rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;