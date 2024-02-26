import { useState } from 'react';

function ControlledCarousel(props) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        // {props.data.images
        //     ? props.data.images.map((d, i) => (
        //         <Carousel.Item key={i}>
        //             <img src={d} alt={d} />
        //             <Carousel.Caption><h3>{d}</h3></Carousel.Caption>
        //         </Carousel.Item>
        //         ))
        //     : "Loading..."}
        // <div id="carouselIndicators" className="carousel slide" data-bs-ride="carousel">
        //     <div className="carousel-indicators">
        //         <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        //         <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        //         <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        //         <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
        //     </div>
        //     <div className="carousel-inner">
        //         {props.data.images ?
        //             props.data.images.map((d, i) => {
        //                 return (
        //                     <div className={i === 0 ? "item active" : "item"} key={i}>
        //                         <img src={d} className="d-block w-100" alt={d} />
        //                     </div>
        //                 )
        //             })
        //         : "loading"
        //         }
        //     </div>
        //     <a className="carousel-control-prev" role="button" data-target="#carouselIndicators" data-slide="prev">
        //         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        //         <span className="sr-only">Previous</span>
        //     </a>
        //     <a className="carousel-control-next" role="button" data-target="#carouselIndicators" data-slide="next">
        //         <span className="carousel-control-next-icon" aria-hidden="true"></span>
        //         <span className="sr-only">Next</span>
        //     </a>
        // </div>
        
        <div id="carouselIndicators" className="carousel slide" data-bs-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#carouselIndicators" data-slide-to="0" class="active"></li>
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
            <div class="carousel-caption d-none d-md-block">            
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