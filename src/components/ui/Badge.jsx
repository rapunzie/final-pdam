const Badge = ({ color, children }) => {
    return (
      <span className={`px-2 py-1 rounded text-white`} style={{ backgroundColor: color }}>
        {children}
      </span>
    );
  };
  
  export default Badge;  