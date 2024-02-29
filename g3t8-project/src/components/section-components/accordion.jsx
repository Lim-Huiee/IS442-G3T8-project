import { useState } from "react";

;
const Accordion = ({qn,ans})=> {
    const [isActive, setIsActive] = useState(false);

  /*const toggle = (i) => {
    if (selected === i) {
      return setSelected(i);
    }
    setSelected(i);
  };*/

  return (
    
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>{qn}</div>
        <div>{isActive ? "-" : "+"}</div>
      </div>
      {isActive && <div className="accordion-content">{ans}</div>}
    </div>
  );
}
export default Accordion;
