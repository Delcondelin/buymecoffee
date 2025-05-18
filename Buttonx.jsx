const Button = ({ value, handleFunction, type, color }) => {
    const base = "py-2 px-6 font-medium text-base rounded-md cursor-pointer";

    const colors = {
        blue: {
            filled: "bg-[#000095] text-white hover:bg-[#0000ff]",
            bordered: "border-2 border-[#000095] text-[#000095] hover:bg-[#0000ff] hover:border-[#0000ff] hover:text-white",
        },
        red: {
            filled: "bg-red-600 text-white hover:bg-red-700",
            bordered: "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
        },
    };

    const colorStyles = colors[color || "blue"]?.[type || "filled"];

    return (
        <button onClick={handleFunction} className={`${base} ${colorStyles}`}>
            {value || "default"}
        </button>
    );
};

export default Button;
