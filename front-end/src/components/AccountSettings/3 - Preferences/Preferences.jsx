import "./Preferences.scss";
import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

import { preferencesContext } from "../../../CustomContexts/Contexts";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

export const Preferences = () => {
  const isWebGlSupported = GetCookies("isWebGlSupported");

  const { preferences: globalPreferences, updateSitePreferences } =
    useContext(preferencesContext);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isWebGlSupported && globalPreferences.animatedBackground) {
      const prefsToUpdate = { ...globalPreferences, animatedBackground: false };
      updateSitePreferences(prefsToUpdate);
      SetCookies(
        "isWebGlSupported",
        "false",
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      );
    }
  }, [globalPreferences, isWebGlSupported, updateSitePreferences]);

  const handlePreferenceToggle = async (e) => {
    const { name, type, checked } = e.target;

    if (name === "animatedBackground" && !isWebGlSupported) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedValue = type === "checkbox" ? checked : e.target.value;
      const prefsToSave = {
        ...globalPreferences,
        [name]: updatedValue,
      };

      await updateSitePreferences(prefsToSave);
      toast.success("Preference updated!", {
        containerId: "notify-success",
      });
    } catch (error) {
      console.error("Error updating preference:", error);
      toast.error("Failed to update preference. Please try again.", {
        containerId: "general-toast",
      });
    } finally {
      setIsSaving(false);
    }
  };

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

          <div>
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
                    isWebGlSupported
                      ? globalPreferences.animatedBackground
                      : false
                  }
                  onChange={handlePreferenceToggle}
                  disabled={!isWebGlSupported || isSaving}
                />
              </Col>
            </Form.Group>

            {isSaving && (
              <div className="text-center text-secondary">Saving...</div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
