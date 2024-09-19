import * as React from "react";
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import getSignUpTheme from "./theme/getSignUpTheme";
import { IRegister } from "../../models/types";
import LoadingButton from "@mui/lab/LoadingButton";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
}));

interface Props {
  onSubmit: (credentials: IRegister) => void;
  isSubmitting: boolean;
  tabChange: (index: number) => void;
}

export default function SignUp(props: Props) {
  const { onSubmit, isSubmitting, tabChange } = props;

  const SignUpTheme = createTheme(getSignUpTheme("light"));
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const validateInputs = () => {
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const fullName = document.getElementById("fullName") as HTMLInputElement;

    let isValid = true;

    if (!username.value) {
      setUsernameError(true);
      setUsernameErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!fullName.value || fullName.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Full Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      const credentials = {
        fullName: data.get("fullName").toString(),
        username: data.get("username").toString(),
        password: data.get("password").toString(),
      };
      onSubmit(credentials);
    }
  };

  return (
    <ThemeProvider theme={SignUpTheme}>
      <CssBaseline enableColorScheme />

      <Stack direction="column" justifyContent="space-between">
        <Stack
          sx={{
            justifyContent: "center",
            p: 2,
          }}
        >
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="fullName">Full name</FormLabel>
                <TextField
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  placeholder="John Doe"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="username"
                  placeholder="johndoe"
                  name="username"
                  variant="outlined"
                  error={usernameError}
                  helperText={usernameErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
              />
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                fullWidth
                variant="contained"
              >
                Sign up
              </LoadingButton>
              <Typography sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <span>
                  <Link
                    onClick={() => tabChange(0)}
                    variant="body2"
                    sx={{ alignSelf: "center", cursor: "pointer" }}
                  >
                    Sign in
                  </Link>
                </span>
              </Typography>
            </Box>
          </Card>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
