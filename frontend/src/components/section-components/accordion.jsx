import { useState } from "react";

;
const Accordion = ({qn,ans})=> {
    const [isActive, setIsActive] = useState(false);

    const handleMouseEnter = () => {
        setIsActive(true);
    };

    const handleMouseLeave = () => {
        setIsActive(false);
    };

    return (
        <div className="accordion-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="accordion-title">
                <div>{qn}</div>
                <div>{isActive ? "-" : "+"}</div>
            </div>
            {isActive && <div className="accordion-content">{ans}</div>}
        </div>
    );
}
export default Accordion;
