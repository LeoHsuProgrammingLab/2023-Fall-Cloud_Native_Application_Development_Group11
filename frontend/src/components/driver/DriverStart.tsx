import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { NavigationBar } from '../navigation/NavigationBar';
import { showStops } from '../../apis/driver.journey.api';
import { Stop } from '../../models/stop.model';
import { ItineraryData } from '../../models/journey.model';

type driverStartProps = {
    setDriverStatus: (status: string) => void;
    setStops: (stops: Stop[]) => void;
    itineraryData: ItineraryData;
    setItineraryData: (itineraryData: ItineraryData) => void;
    isGo: boolean;
    setIsGo: (isGo: boolean) => void;
}

export const DriverStart = (props: driverStartProps) => {
  const { setDriverStatus, setStops, itineraryData, setItineraryData, isGo, setIsGo } = props;

  const toDriverStopsPage = async () => {
    const queryData = {
        isGo: isGo,
        address: isGo ? itineraryData.start : itineraryData.destination,
    }
    try {
        const response = await showStops(queryData);
        setStops(response.Stops);
        setDriverStatus('stops');
    }
    catch (error: any) {
        console.log(error);
    }
    setDriverStatus('stops') // TODO: remove this line after API worked
  }

  const driverFavRouteToWork: ItineraryData = {
    start: '台大',
    destination: '台積電',
    passengerCount : '4',
    date: dayjs('2023-12-21'),
    time: dayjs('15:00:00', "HH:mm:ss"),
  }

  const driverFavRouteToHome: ItineraryData = {
    start: '台積電',
    destination: '中正紀念堂',
    passengerCount : '4',
    date: dayjs('2023-12-21'),
    time: dayjs('15:00:00', "HH:mm:ss"),
  }

  const handleInputChange = (field: keyof ItineraryData, value: string | number | Dayjs | null) => {
    const updatedItineraryData = {
        ...itineraryData,
        [field]: value,
      };
    setItineraryData(updatedItineraryData);
  };

  const useFavoriteRoute = () => {
    if (isGo) {
        setItineraryData(driverFavRouteToWork);
    }
    else {
        setItineraryData(driverFavRouteToHome);
    }
  }

  const toWork = () => {
    setIsGo(true);
    const updatedItineraryData = {
        ...itineraryData,
        ["start"]: "",
        ["destination"]: "台積電",
    }
    setItineraryData(updatedItineraryData);
  }

  const toHome = () => {
    setIsGo(false);
    const updatedItineraryData = {
        ...itineraryData,
        ["start"]: "台積電",
        ["destination"]: "",
    }
    setItineraryData(updatedItineraryData);
  }


  return (
    <>
        <Container maxWidth="xs">
          <NavigationBar></NavigationBar>
          <Container sx={{ width: 0.8 }} >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight="90vh"
            >
              <div>
                <Typography variant="h4" fontWeight="bold">
                  Driver
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  Start journey
                </Typography>
                <ButtonGroup 
                    variant="outlined" 
                    aria-label="outlined button group"
                    size="small"
                    sx={{
                        color : "secondary",
                        mt: 2,
                    }}
                >
                    <Button onClick={toWork}>Go to Work</Button>
                    <Button onClick={toHome}>Back Home</Button>
                </ButtonGroup>
                <Button variant="contained" 
                  sx={{
                    textTransform : "none",
                    mb: 2, mt: 2,
                  }}
                  onClick={useFavoriteRoute}
                >
                  Use favorite route
                </Button>
                <div>
                  Start
                  <TextField
                    fullWidth
                    label="Enter your start location"
                    size="small"
                    sx={{ mb: 1.5, mt: 1 }}
                    value={itineraryData.start}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('start', e.target.value)}
                    disabled={!isGo}
                  />
                  Destination
                  <TextField
                    fullWidth
                    label="Enter your destination location"
                    size="small" 
                    sx={{ mb: 1.5, mt: 1 }}
                    value={itineraryData.destination}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('destination', e.target.value)}
                    disabled={isGo}
                  />
                  Passenger Count
                  <Select
                    fullWidth
                    size='small'
                    sx={{ mb: 1.5, mt: 1 }}
                    value={itineraryData.passengerCount}
                    onChange={(e: SelectChangeEvent) => handleInputChange('passengerCount', e.target.value)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                  <Box
                    display="flex"
                    flexDirection="row"
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}> 
                      <Box sx={{ mr:2 }} >
                        Date
                        <MobileDatePicker 
                          defaultValue={dayjs()} 
                          slotProps={{ textField: {size: 'small'} }} 
                          sx={{ mt: 1 }}
                          value={itineraryData.date}
                          onChange={(newDate) => handleInputChange('date', newDate)}
                        />
                      </Box>
                      <Box sx={{ ml:1 }} >
                        Time
                        <MobileTimePicker 
                          defaultValue={dayjs()} 
                          slotProps={{ textField: {size: 'small'} }} 
                          sx={{ mt: 1 }}
                          value={itineraryData.time}
                          onChange={(newTime) => handleInputChange('time', newTime)}
                        />
                      </Box>
                    </LocalizationProvider>
                  </Box>
                  <Button variant="contained" fullWidth onClick={toDriverStopsPage}
                    sx={{
                      textTransform : "none",
                      backgroundColor : "secondary.main",
                      mb: 1, mt: 3,
                    }}
                    disabled={itineraryData.start === "" || itineraryData.destination === ""}
                  >
                    Select Stops
                  </Button>
                </div>
              </div>
            </Box>
          </Container>
        </Container>
    </>
  )
} 