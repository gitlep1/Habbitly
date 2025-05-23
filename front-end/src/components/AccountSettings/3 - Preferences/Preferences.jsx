import "./Preferences.scss";
import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

import { GetCookies, SetCookies } from "../../../CustomFunctions/HandleCookies";

const defaultPreferences = {
  animatedBackground: true,
  uiSounds: true,
  showWelcomeTour: true,
  compactMode: false,
};

export const Preferences = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [originalPreferences, setOriginalPreferences] =
    useState(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferencesFromCookie();
  }, []);

  const loadPreferencesFromCookie = () => {
    const userCookieData = GetCookies("preferences");
    if (userCookieData && typeof userCookieData === "object") {
      const loadedPrefs = {
        ...defaultPreferences,
        animatedBackground:
          userCookieData.animatedBackground !== undefined
            ? userCookieData.animatedBackground
            : defaultPreferences.animatedBackground,
        uiSounds:
          userCookieData.uiSounds !== undefined
            ? userCookieData.uiSounds
            : defaultPreferences.uiSounds,
        showWelcomeTour:
          userCookieData.showWelcomeTour !== undefined
            ? userCookieData.showWelcomeTour
            : defaultPreferences.showWelcomeTour,
        compactMode:
          userCookieData.compactMode !== undefined
            ? userCookieData.compactMode
            : defaultPreferences.compactMode,
      };
      setPreferences(loadedPrefs);
      setOriginalPreferences(loadedPrefs);
    } else {
      setPreferences(defaultPreferences);
      setOriginalPreferences(defaultPreferences);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPreferences((prevPrefs) => ({
      ...prevPrefs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const userCookieData = GetCookies("authUser");
      if (userCookieData && typeof userCookieData === "object") {
        const updatedUserCookieData = {
          ...preferences,
        };

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        SetCookies("preferences", updatedUserCookieData, expirationDate);

        setOriginalPreferences(preferences);
        toast.success("Preferences saved successfully!", {
          containerId: "notify-success",
        });
      } else {
        toast.error("User data not found in cookie. Cannot save preferences.", {
          containerId: "general-toast",
        });
      }
    } catch (error) {
      console.error("Error saving preferences to cookie:", error);
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
                Animated Background
              </Form.Label>
              <Col sm="4" className="text-end">
                <Form.Check
                  type="switch"
                  id="animated-background-switch"
                  name="animatedBackground"
                  checked={preferences.animatedBackground}
                  onChange={handlePreferenceChange}
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
