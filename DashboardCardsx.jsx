const Cards = ({content,value}) => {
    return (
        <>
            <div className="card flex flex-col p-4 w-full h-full shadow-md rounded-md">
                <div className="title">
                    <span className="font-medium">{ content }</span>
                </div>
                <div className="body h-full mt-1">
                    <span className="font-base text-3xl">{value || 0}</span>
                </div>
            </div>
        </>
    );
}

export default Cards;