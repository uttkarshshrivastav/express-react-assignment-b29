const Card = ({ children, className = "" }) => {
  return (
    <div className={`mx-auto w-full bg-card-bg border border-white rounded-lg p-6 text-center ${className}`}>
      {children}
    </div>
  );
};

export default Card;
