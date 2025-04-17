const ErrorMessage = ({ errorMessage }) => {
    return errorMessage ? (
      <div className="text-red-500 text-sm mt-2 md:col-span-2 text-center">
        {errorMessage}
      </div>
    ) : null;
  };
  
  export default ErrorMessage;
  