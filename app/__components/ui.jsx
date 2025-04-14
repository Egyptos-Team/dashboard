const Button = ({ children, onClick, variant = 'primary' }) => {
    const base = 'px-4 py-2 rounded font-medium transition-all';
  
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    };
  
    return (
      <button onClick={onClick} className={`${base} ${variants[variant]}`}>
        {children}
      </button>
    );
  };
  
  export default Button;
  