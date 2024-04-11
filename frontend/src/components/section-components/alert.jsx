import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertDismissibleExample({variant, header, body}) {
    const [show, setShow] = useState(true);
  
    if (show) {
      return (
        <Alert variant={variant} onClose={() => setShow(false)} dismissible style={{opacity:100, marginTop: 30 }}>
          <Alert.Heading>{header}</Alert.Heading>
          <p>
            {body}
          </p>
        </Alert>
      );
    }
  }
  
  export default AlertDismissibleExample;