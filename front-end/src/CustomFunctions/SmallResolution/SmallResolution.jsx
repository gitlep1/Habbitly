import "./SmallResolution.scss";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { SetCookies } from "../../CustomFunctions/HandleCookies";
import Cookies from "js-cookie";

const SmallResolution = () => {
  const initialCookie = Cookies.get("small-resolution-warning");
  const [warningCookie, setWarningCookie] = useState(
    initialCookie
      ? JSON.parse(initialCookie)
      : { warningNum: 0, displayWarning: true }
  );

  const [warning, setWarning] = useState(true);
  const [showWarningDisplay, setShowWarningDisplay] = useState(true);

  const handleWarning = () => {
    setWarning(false);

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    const newWarningCookie = { ...warningCookie };

    if (warningCookie.warningNum === 0) {
      newWarningCookie.warningNum = 1;
    } else {
      newWarningCookie.warningNum += 1;
    }

    if (!showWarningDisplay) {
      newWarningCookie.displayWarning = false;
    }

    SetCookies("small-resolution-warning", newWarningCookie, expirationDate);
    setWarningCookie(newWarningCookie);
  };

  return (
    warningCookie.displayWarning && (
      <div
        className="small-resolution min-h-screen min-w-screen"
        style={warning ? null : { display: "none" }}
      >
        <h1 style={{ color: "yellow" }}>WARNING</h1>
        <h2>Your screen&apos;s width is to small.</h2>
        <p>(less than 400px)</p>
        <h4>Some elements on the page may display incorrectly.</h4>
        {warningCookie.warningNum >= 3 && (
          <Form>
            <Form.Check
              type="checkbox"
              label="Ignore these warnings?"
              onChange={() => {
                setShowWarningDisplay(false);
              }}
            />
          </Form>
        )}
        <Button variant="success" onClick={handleWarning}>
          I understand
        </Button>
      </div>
    )
  );
};

export default SmallResolution;
