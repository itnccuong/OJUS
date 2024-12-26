import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import getToken from "../../utils/getToken";
import axiosInstance from "../../utils/axiosInstance.ts";
import Loader from "../../components/Loader.tsx";
import {
  ProfilePayloadInterface,
  UserWithAvatarInterface,
} from "../../interfaces/interface.ts";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import useFetch from "../../hooks/useFetch.ts";
interface EditProfileInterface {
  fullname: string;
  facebookLink: string;
  githubLink: string;
}

export default function EditProfile() {
  const token = getToken();
  const [profile, setProfile] = useState<EditProfileInterface>({
    fullname: "",
    facebookLink: "",
    githubLink: "",
  });

  const [editingFields, setEditingFields] = useState({
    fullname: false,
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

  const { data, loading } = useFetch<{ user: UserWithAvatarInterface }>(
    "/api/user",
    {
      includeToken: true,
    },
  );

  const userData = data?.data.user;
  useEffect(() => {
    setProfile({
      fullname: userData?.fullname || "",
      facebookLink: userData?.facebookLink || "",
      githubLink: userData?.githubLink || "",
    });
  }, [userData]);

  if (loading || !profile) {
    return <Loader />;
  }
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
        if (!passwordFields.currentPassword) {
          newErrors.currentPassword =
            "Current password is required to change password";
        }
        if (!passwordFields.newPassword) {
          newErrors.newPassword = "New password is required to change password";
        }
        if (!passwordFields.confirmNewPassword) {
          newErrors.confirmNewPassword =
            "Confirm password is required to change password";
        }
        if (
          passwordFields.newPassword &&
          passwordFields.confirmNewPassword &&
          passwordFields.newPassword !== passwordFields.confirmNewPassword
        ) {
          newErrors.confirmNewPassword = "Passwords do not match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldSubmit = async (field: string) => {
    let isValid = true;
    const payload: ProfilePayloadInterface = {};

    switch (field) {
      case "fullname":
        isValid = validateField("fullname", profile.fullname);
        payload.fullname = profile.fullname;
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
      await toast.promise(
        axiosInstance.patch("/api/user", payload, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          pending: "Updating...",
          success: "Update profile successfully",
        },
      );

      setEditingFields((prev) => ({
        ...prev,
        [field]: false,
      }));

      if (field === "password") {
        setPasswordFields({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  return (
    <div className="d-flex flex-grow-1 justify-content-center align-items-center bg-light p-5">
      <div
        className="bg-white border border-dark-subtle shadow rounded-4 p-4"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">Edit Profile</h2>

        {/* Full Name */}
        <div className="mb-3">
          <div className="d-flex align-items-center border-bottom pb-3">
            <span className="w-25 fw-bold">Full Name</span>
            {editingFields.fullname ? (
              <div>
                <Form.Control
                  type="text"
                  name="fullname"
                  required={true}
                  value={profile.fullname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                  isInvalid={!!errors.fullname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullname}
                </Form.Control.Feedback>
              </div>
            ) : (
              <span
                className="w-50"
                style={{
                  marginLeft: "21px",
                }}
              >
                {profile.fullname ? profile.fullname : "Not set"}
              </span>
            )}
            {editingFields.fullname ? (
              <>
                <Button
                  className="ms-4"
                  style={{
                    width: "75px",
                  }}
                  variant="success"
                  onClick={() => handleFieldSubmit("fullname")}
                >
                  Save
                </Button>
                <Button
                  className="ms-2"
                  style={{
                    width: "75px",
                  }}
                  variant="outline-danger"
                  onClick={() => toggleEditField("fullname")}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span
                  className="ms-4"
                  style={{
                    width: "75px",
                  }}
                />

                <Button
                  className="ms-2"
                  style={{
                    width: "75px",
                  }}
                  variant="outline-primary"
                  onClick={() => toggleEditField("fullname")}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Facebook Link */}
        <div className="mb-3">
          <div className="d-flex align-items-center border-bottom pb-3">
            <span className="w-25 fw-bold">Facebook</span>
            {editingFields.facebookLink ? (
              <div>
                <Form.Control
                  placeholder={"Enter your Facebook link"}
                  type="text"
                  name="facebookLink"
                  value={profile.facebookLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                  isInvalid={!!errors.facebookLink}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.facebookLink}
                </Form.Control.Feedback>
              </div>
            ) : (
              <Link
                to={profile.facebookLink ? profile.facebookLink : "#"}
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Open in new tab
                className="w-50 text-truncate"
                style={{
                  marginLeft: "21px",
                  display: "inline-block", // Required for text truncation
                  whiteSpace: "nowrap", // Prevents text wrapping
                  overflow: "hidden", // Hides overflow content
                  textOverflow: "ellipsis", // Adds the three dots
                  textDecoration: "none",
                }}
              >
                {profile.facebookLink ? profile.facebookLink : "Not set"}
              </Link>
            )}
            {editingFields.facebookLink ? (
              <>
                <Button
                  className="ms-4"
                  style={{
                    width: "75px",
                  }}
                  variant="success"
                  onClick={() => handleFieldSubmit("facebookLink")}
                >
                  Save
                </Button>
                <Button
                  className="ms-2"
                  style={{
                    width: "75px",
                  }}
                  variant="outline-danger"
                  onClick={() => toggleEditField("facebookLink")}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span
                  className="ms-4"
                  style={{
                    width: "75px",
                  }}
                />

                <Button
                  className="ms-2"
                  style={{
                    width: "75px",
                  }}
                  variant="outline-primary"
                  onClick={() => toggleEditField("facebookLink")}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* GitHub Link */}
        <div className="mb-3">
          <div className="d-flex align-items-center border-bottom pb-3">
            <span className="w-25 fw-bold">Github</span>
            {editingFields.githubLink ? (
              <div>
                <Form.Control
                  placeholder={"Enter your github link"}
                  type="text"
                  name="githubLink"
                  value={profile.githubLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProfileChange(e)
                  }
                  isInvalid={!!errors.githubLink}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.githubLink}
                </Form.Control.Feedback>
              </div>
            ) : (
              <Link
                to={profile.githubLink ? profile.githubLink : "#"}
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Open in new tab
                className="w-50 text-truncate"
                style={{
                  marginLeft: "21px",
                  display: "inline-block", // Required for text truncation
                  whiteSpace: "nowrap", // Prevents text wrapping
                  overflow: "hidden", // Hides overflow content
                  textOverflow: "ellipsis", // Adds the three dots
                  textDecoration: "none",
                }}
              >
                {profile.githubLink ? profile.githubLink : "Not set"}
              </Link>
            )}
            {editingFields.githubLink ? (
              <>
                <Button
                  className="ms-4"
                  style={{
                    width: "75px",
                  }}
                  variant="success"
                  onClick={() => handleFieldSubmit("githubLink")}
                >
                  Save
                </Button>
                <Button
                  className="ms-2"
                  style={{
                    width: "75px",
                  }}
                  variant="outline-danger"
                  onClick={() => toggleEditField("githubLink")}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span
                  className="ms-4"
                  style={{
                    width: "75px",
                  }}
                />

                <Button
                  className="ms-2"
                  style={{
                    width: "75px",
                  }}
                  variant="outline-primary"
                  onClick={() => toggleEditField("githubLink")}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Password</span>
            <Button
              className="ms-2"
              style={{
                width: "67px",
              }}
              variant={
                editingFields.password ? "outline-danger" : "outline-primary"
              }
              onClick={() => toggleEditField("password")}
            >
              {editingFields.password ? "Cancel" : "Edit"}
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
        </div>
      </div>
    </div>
  );
}
