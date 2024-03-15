import { useState } from 'react';

function ControlledCarousel(props) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        
        <div id="carouselIndicators" className="carousel slide" data-bs-ride="carousel">
            <ol className="carousel-indicators">
                <li data-target="#carouselIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselIndicators" data-slide-to="1"></li>
                <li data-target="#carouselIndicators" data-slide-to="2"></li>
            </ol>
            
            <div className="carousel-inner">
                {props.data.images ?
                    props.data.images.map((d, i) => {
                        return (
                                <div className={i === 0 ? "item active" : "item"} key={i}>
                                    <img src={d} className="d-block w-100" alt={d} />
                                </div>
                        )
                    })
                : "loading"
                }
            </div>
            <div className="carousel-caption d-none d-md-block" style={{marginBottom:"2.5%"}}>            
                <a href="/eventsView" className="btn btn-custom btn-lg page-scroll ">View events</a>
            </div>
            <a className="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    );
}

export default ControlledCarousel;