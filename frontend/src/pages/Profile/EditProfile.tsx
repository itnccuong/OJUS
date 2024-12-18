import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import getToken from "../../../utils/getToken";
import axiosInstance from "../../../utils/getURL";
import Loader from "../../components/Loader.tsx";
import { ProfilePayloadInterface } from "../../../interfaces/model.interface.ts";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
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
  const [loading, setLoading] = useState(true);

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
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  if (loading) {
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
    // setSuccessMessage("");
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
  console.log("Profile data before showed: ", profile);

  return (
    <div>
      <NavBar />
      <div
        className="d-flex justify-content-center align-items-center bg-light p-5"
        style={{ minHeight: "87vh" }}
      >
        <Container
          className="bg-white shadow rounded-4 p-4"
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
        </Container>
      </div>
      <Footer />
    </div>
  );
}
