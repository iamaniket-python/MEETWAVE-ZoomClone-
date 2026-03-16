import React, { useState, useContext } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Link from "@mui/material/Link";

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

const RegisterContainer = styled(Stack)(() => ({
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle at center, #e3f2fd, #ffffff)",
}));

export default function Register() {

  const { handelRegister } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handelRegister(name, email, password);

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <CssBaseline />

      <RegisterContainer>
        <Card>

          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "gray" }}
          >
            Register to start using MeetWave
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
              <FormLabel>Full Name</FormLabel>
              <TextField
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </FormControl>

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
              Register
            </Button>

          </Box>

          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Already have an account?
            <Link href="/signin" sx={{ ml: 1 }}>
              Sign in
            </Link>
          </Typography>

        </Card>
      </RegisterContainer>
    </>
  );
}