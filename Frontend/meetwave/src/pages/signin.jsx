import React, { useState, useContext } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";

import { styled } from "@mui/material/styles";
import { AuthContext } from "../contexts/Authcontext";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(5),
  gap: theme.spacing(2),
  margin: "auto",
  borderRadius: "16px",

  [theme.breakpoints.up("sm")]: {
    maxWidth: "420px",
  },

  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
}));

const SignInContainer = styled(Stack)(() => ({
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle at center, #e3f2fd, #ffffff)",
}));

export default function Signin() {
  const { handelLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  // ✅ Correct submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await handelLogin(email, password);

    if (res?.success) {
      setError("");
      // redirect or success action
    } else {
      setError(res?.message || "Login failed");
    }
  };

  return (
    <>
      <CssBaseline />

      <SignInContainer>
        <Card>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Sign In
          </Typography>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "gray" }}
          >
            Enter your credentials to continue
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel>Email</FormLabel>

              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>

              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••"
                fullWidth
              />
            </FormControl>

            <FormControlLabel control={<Checkbox />} label="Remember me" />

            {error && (
              <Typography color="error" sx={{ textAlign: "center" }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.4,
                fontWeight: 600,
                fontSize: "16px",
                borderRadius: "10px",
                background: "linear-gradient(135deg,#FFD400,#FFB300)",
                color: "black",
                "&:hover": {
                  background: "linear-gradient(135deg,#FFC107,#FFA000)",
                },
              }}
            >
              Login
            </Button>
          </Box>

          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Don't have an account? <Link href="/register">Sign up</Link>
          </Typography>
        </Card>
      </SignInContainer>
    </>
  );
}
