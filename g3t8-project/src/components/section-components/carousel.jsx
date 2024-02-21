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
        <div id="carouselIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div className="carousel-inner">
                {props.data.images ?
                    props.data.images.map((d, i) => {
                        return (
                            <div className={i === 0 ? "carousel-item active" : "carousel-item"} key={i}>
                                <img src={d} className="d-block w-100" alt={d} />
                            </div>
                        )
                    })
                : "loading"
                }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default ControlledCarousel;