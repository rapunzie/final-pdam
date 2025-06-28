const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`p-96 rounded-lg shadow-md bg-white ${className}`}>
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;