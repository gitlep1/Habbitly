import "./Preferences.scss";
import { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

import { preferencesContext } from "../../../CustomContexts/Contexts";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

export const Preferences = () => {
  const isWebGlSupported = GetCookies("isWebGlSupported");

  const { preferences: globalPreferences, updateSitePreferences } =
    useContext(preferencesContext);

  const [preferences, setPreferences] = useState(() => {
    const initialPrefs = { ...globalPreferences };
    if (!isWebGlSupported) {
      initialPrefs.animatedBackground = false;
    }
    return initialPrefs;
  });

  const [originalPreferences, setOriginalPreferences] =
    useState(globalPreferences);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPreferences((prevPrefs) => {
      const updatedPrefs = { ...globalPreferences };
      if (!isWebGlSupported) {
        updatedPrefs.animatedBackground = false;
      }
      return updatedPrefs;
    });
    setOriginalPreferences(globalPreferences);
  }, [globalPreferences, isWebGlSupported]);

  const handlePreferenceChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "animatedBackground" && !isWebGlSupported) {
      return;
    }

    setPreferences((prevPrefs) => ({
      ...prevPrefs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const prefsToSave = { ...preferences };
      if (!isWebGlSupported) {
        prefsToSave.animatedBackground = false;
        SetCookies(
          "isWebGlSupported",
          "false",
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        );
      }

      updateSitePreferences(prefsToSave);
      toast.success("Preferences saved successfully!", {
        containerId: "notify-success",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.", {
        containerId: "general-toast",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled =
    isSaving ||
    JSON.stringify(preferences) === JSON.stringify(originalPreferences);

  return (
    <div className="preferences-container p-4 md:p-8">
      <Card className="preferences-card mt-[6em] md:mt-0 shadow-xl rounded-2xl">
        <Card.Body>
          <div className="mb-2 flex justify-center text-primary">
            <i className="bi bi-sliders2" style={{ fontSize: "1.5rem" }}></i>
            <span className="text-lg font-semibold">
              Adjust your experience
            </span>
          </div>
          <h1 className="preferences-title mb-4">Site Preferences</h1>

          <Form onSubmit={handleSavePreferences}>
            <h3 className="section-subtitle">Visuals & Experience</h3>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="animatedBackground"
            >
              <Form.Label column sm="8">
                3D Animated Background
                {!isWebGlSupported && (
                  <small className="d-block text-danger mt-1">
                    WebGL is not supported on your device.
                  </small>
                )}
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="animated-background-switch"
                  name="animatedBackground"
                  checked={
                    isWebGlSupported ? preferences.animatedBackground : false
                  }
                  onChange={handlePreferenceChange}
                  disabled={!isWebGlSupported}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="compactMode">
              <Form.Label column sm="8">
                Compact UI Mode
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="compact-mode-switch"
                  name="compactMode"
                  checked={preferences.compactMode}
                  onChange={handlePreferenceChange}
                />
              </Col>
            </Form.Group>

            <hr className="my-4" />

            <h3 className="section-subtitle">Sound & Guidance</h3>
            <Form.Group as={Row} className="mb-3" controlId="uiSounds">
              <Form.Label column sm="8">
                UI Sound Effects
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="ui-sounds-switch"
                  name="uiSounds"
                  checked={preferences.uiSounds}
                  onChange={handlePreferenceChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="showWelcomeTour">
              <Form.Label column sm="8">
                Show Welcome Tour & Tips
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="welcome-tour-switch"
                  name="showWelcomeTour"
                  checked={preferences.showWelcomeTour}
                  onChange={handlePreferenceChange}
                />
              </Col>
            </Form.Group>

            <div className="text-center pt-4">
              <Button
                variant="primary"
                type="submit"
                className="px-6"
                disabled={isSaveDisabled}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
