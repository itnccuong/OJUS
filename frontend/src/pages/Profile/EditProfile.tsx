import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import getToken from "../../../utils/getToken";
import axiosInstance from "../../../utils/getURL";

interface UserProfile {
  fullname: string;
  gender: string;
  birthday: string;
  facebookLink?: string;
  githubLink?: string;
  username: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const token = getToken();
  const [profile, setProfile] = useState<UserProfile>({
    fullname: "",
    gender: "",
    birthday: "",
    facebookLink: "",
    githubLink: "",
    username: "",
  });

  const [editingFields, setEditingFields] = useState({
    fullname: false,
    gender: false,
    birthday: false,
    facebookLink: false,
    githubLink: false,
    password: false,
  });

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/accounts/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Data User:", response.data.data.user);
        const {
          fullname,
          gender,
          birthday,
          facebookLink,
          githubLink,
          username,
        } = response.data.data.user;
        console.log(
          "Data init: ",
          fullname,
          gender,
          birthday,
          facebookLink,
          githubLink,
          username,
        );
        setProfile(() => {
          const newProfile = {
            fullname,
            gender,
            birthday,
            facebookLink,
            githubLink,
            username,
          };
          console.log("Updated Profile:", newProfile);
          return newProfile;
        });
        console.log("Profile showed:", profile);
      } catch (error) {
        console.error("Error fetching profile", error);
        setGeneralError("Failed to load profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  const toggleEditField = (field: keyof typeof editingFields) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    setSuccessMessage("");
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (field: string, value: string) => {
    const newErrors: { [key: string]: string } = {};

    switch (field) {
      case "fullname":
        if (!value.trim()) {
          newErrors.fullname = "Full name is required";
        }
        break;
      case "password":
        if (passwordFields.newPassword !== passwordFields.confirmNewPassword) {
          newErrors.confirmNewPassword = "Passwords do not match";
        }
        if (!passwordFields.currentPassword) {
          newErrors.currentPassword =
            "Current password is required to change password";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldSubmit = async (field: string) => {
    setGeneralError("");
    setSuccessMessage("");

    let isValid = true;
    let payload: any = {};

    switch (field) {
      case "fullname":
        isValid = validateField("fullname", profile.fullname);
        payload.fullname = profile.fullname;
        break;
      case "gender":
        payload.gender = profile.gender;
        break;
      case "birthday":
        payload.birthday = profile.birthday ? new Date(profile.birthday) : null;
        break;
      case "facebookLink":
        payload.facebookLink = profile.facebookLink || null;
        break;
      case "githubLink":
        payload.githubLink = profile.githubLink || null;
        break;
      case "password":
        isValid = validateField("password", "");
        if (isValid) {
          payload.currentPassword = passwordFields.currentPassword;
          payload.newPassword = passwordFields.newPassword;
        }
        break;
    }

    if (!isValid) return;

    try {
      const response: { data: { message?: string } } =
        await axiosInstance.patch("/api/user", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

      setEditingFields((prev) => ({
        ...prev,
        [field]: false,
      }));

      setSuccessMessage(
        response.data.message ||
          `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`,
      );

      if (field === "password") {
        setPasswordFields({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Update error", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to update ${field}. Please try again.`;

      setGeneralError(errorMessage);
    }
  };
  console.log("Profile data before showed: ", profile);

  return (
    <div>
      <NavBar />
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "87vh" }}
      >
        <Container
          className="bg-white shadow rounded p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h2 className="text-center mb-4">Edit Profile</h2>

          {generalError && (
            <div className="alert alert-danger">{generalError}</div>
          )}

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {/* Full Name */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Full Name</Form.Label>
              <Button
                variant="link"
                onClick={() => toggleEditField("fullname")}
              >
                {editingFields.fullname ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editingFields.fullname ? (
              <>
                <Form.Control
                  type="text"
                  name="fullname"
                  value={profile.fullname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                  isInvalid={!!errors.fullname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullname}
                </Form.Control.Feedback>
                <Button
                  variant="primary"
                  className="mt-2 w-100"
                  onClick={() => handleFieldSubmit("fullname")}
                >
                  Save Full Name
                </Button>
              </>
            ) : (
              <Form.Control
                plaintext
                readOnly
                defaultValue={profile.fullname ? profile.fullname : "Not set"}
              />
            )}
          </Form.Group>

          {/* Gender */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Gender</Form.Label>
              <Button variant="link" onClick={() => toggleEditField("gender")}>
                {editingFields.gender ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editingFields.gender ? (
              <>
                <Form.Select
                  name="gender"
                  value={profile.gender}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleProfileChange(e)
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
                <Button
                  variant="primary"
                  className="mt-2 w-100"
                  onClick={() => handleFieldSubmit("gender")}
                >
                  Save Gender
                </Button>
              </>
            ) : (
              <Form.Control
                plaintext
                readOnly
                defaultValue={profile.gender || "Not set"}
              />
            )}
          </Form.Group>

          {/* Birthday */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Birthday</Form.Label>
              <Button
                variant="link"
                onClick={() => toggleEditField("birthday")}
              >
                {editingFields.birthday ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editingFields.birthday ? (
              <>
                <Form.Control
                  type="date"
                  name="birthday"
                  value={profile.birthday}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                />
                <Button
                  variant="primary"
                  className="mt-2 w-100"
                  onClick={() => handleFieldSubmit("birthday")}
                >
                  Save Birthday
                </Button>
              </>
            ) : (
              <Form.Control
                plaintext
                readOnly
                defaultValue={
                  profile.birthday
                    ? new Date(profile.birthday).toLocaleDateString()
                    : "Not set"
                }
              />
            )}
          </Form.Group>

          {/* Facebook Link */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Facebook Link</Form.Label>
              <Button
                variant="link"
                onClick={() => toggleEditField("facebookLink")}
              >
                {editingFields.facebookLink ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editingFields.facebookLink ? (
              <>
                <Form.Control
                  type="url"
                  name="facebookLink"
                  value={profile.facebookLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                  placeholder="https://facebook.com/your-profile"
                />
                <Button
                  variant="primary"
                  className="mt-2 w-100"
                  onClick={() => handleFieldSubmit("facebookLink")}
                >
                  Save Facebook Link
                </Button>
              </>
            ) : (
              <Form.Control
                plaintext
                readOnly
                defaultValue={profile.facebookLink || "Not set"}
              />
            )}
          </Form.Group>

          {/* GitHub Link */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>GitHub Link</Form.Label>
              <Button
                variant="link"
                onClick={() => toggleEditField("githubLink")}
              >
                {editingFields.githubLink ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editingFields.githubLink ? (
              <>
                <Form.Control
                  type="url"
                  name="githubLink"
                  value={profile.githubLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                  placeholder="https://github.com/your-username"
                />
                <Button
                  variant="primary"
                  className="mt-2 w-100"
                  onClick={() => handleFieldSubmit("githubLink")}
                >
                  Save GitHub Link
                </Button>
              </>
            ) : (
              <Form.Control
                plaintext
                readOnly
                defaultValue={profile.githubLink || "Not set"}
              />
            )}
          </Form.Group>

          {/* Change Password */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Change Password</Form.Label>
              <Button
                variant="link"
                onClick={() => toggleEditField("password")}
              >
                {editingFields.password ? "Cancel" : "Change Password"}
              </Button>
            </div>
            {editingFields.password && (
              <>
                <FloatingLabel label="Current Password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordFields.currentPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange(e)
                    }
                    placeholder="Enter current password"
                    isInvalid={!!errors.currentPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.currentPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel label="New Password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordFields.newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange(e)
                    }
                    placeholder="Enter new password"
                    isInvalid={!!errors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel label="Confirm New Password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="confirmNewPassword"
                    value={passwordFields.confirmNewPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange(e)
                    }
                    placeholder="Confirm new password"
                    isInvalid={!!errors.confirmNewPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmNewPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => handleFieldSubmit("password")}
                >
                  Change Password
                </Button>
              </>
            )}
          </Form.Group>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
