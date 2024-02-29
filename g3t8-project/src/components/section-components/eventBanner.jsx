export const EventBanner = ({pageTitle, date, venue, image, price}) => { 
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col text-center p-0">
                    <img src={image} className="w-100" alt="Loading..." />
                </div>
            </div>
            <div className="row py-3" style={{backgroundColor:"#C0C0C0"}}>
                <div className="container">
                    <div className="row">
                        <div className="col text-left">
                            <h2>{pageTitle}</h2>
                            <h4>Date: {date}</h4>
                            <h4>Venue: {venue}</h4>
                            <h4>Ticket price: {price}</h4>
                        </div>
                        <div className="col text-end my-auto">
                            <a href="/" className="btn btn-custom btn-lg page-scroll">Buy Tickets</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
