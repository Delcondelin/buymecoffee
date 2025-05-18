const Input = ({ type = "text", name, placeholder, value, onChange }) => {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="py-2 px-3 border w-full rounded-md my-1"
        />
    );
};

export default Input;
