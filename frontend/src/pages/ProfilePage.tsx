import * as React from 'react';
import { useState } from 'react';
import { useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ProfileSelection } from "../components/profile/ProfileSelection";
import { UserInfo } from "../components/profile/UserInfo";
import { FavRoute } from '../components/profile/FavRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#313944'
    }
  }
});

enum ProfileStatus {
  Home = "home",
  UserInfo = "userInfo",
  FavRoute = "favRoute",
  CarInfo = "carInfo",
}

const user = {
  name: "example",
  email: "123@gmail.com",
  phone: "0900000000",
  gender: "Male",
  home: "台北市中正區思源街16-3號",
  company: "桃園市龍潭區龍園六路101號",
  wallet: "$100",
  start: "台北市中正區思源街16-3號",
  destination: "桃園市龍潭區龍園六路101號",
  time: "9:00 a.m.",
  people: 2
}

export const ProfilePage = () => {
  // const {state} = useLocation();
  // const { isDriver, name } = state;
  const [status, setStatus] = useState<string>(ProfileStatus.Home);
  return (
    <>
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '95vh',
          }}
        >
          <CssBaseline />
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                ml: 3,
                mr: 3,
                pt: "10px",
                pl: "20px",
                pr: "20px",
                minHeight: "70vh"
              }}
            >
              {status === "home" && <ProfileSelection setStatus={setStatus} />}
              {status === "userInfo" && <UserInfo setStatus={setStatus} User={user}/>}
              {status === "favRoute" && <FavRoute setStatus={setStatus} User={user}/>}
            </Box>
          </Container>
        </div>
      </ThemeProvider>
      {/* {status === "home" && <ProfileSelection setStatus={setStatus} />}
      {status === "userInfo" && <UserInfo setStatus={setStatus} />} */}
    </>
  );
}