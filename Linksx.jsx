import { Link } from "react-router-dom"

const Glink = ({ path, value }) => {
    return (
        <Link to={path} className="py-2 px-2 capitalize hover:text-blue-400 text-[#0000ff] font-medium hover:text-[#0000ff] text-base">{value || "Link"}</Link>
    )
}

export default Glink;
