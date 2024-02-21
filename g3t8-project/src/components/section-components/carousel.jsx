import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function ControlledCarousel(props) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
        {props.data
            ? props.data.map((d, i) => (
                <Carousel.Item>
                    <img src={d} />
                </Carousel.Item>
                ))
            : "Loading..."}
        
        {/* <Carousel.Item>
        </Carousel.Item> */}
        </Carousel>
    );
}

export default ControlledCarousel;