import { useState, useRef, RefObject } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { userInfo } from '../../../models/user.model';

const MidButton = styled(Button)({
  textTransform: 'none',
  fontSize: "14px",
  height: "40px",
  width: "275px",
  background: "#9C694C",
});

const HalfButton = styled(Button)({
  textTransform: 'none',
  fontSize: "14px",
  height: "40px",
  width: "130px"
});

const SelectItem = styled(MenuItem)({
  fontSize: "14px"
})

type UserProps = {
  setStatus: (status: string) => void;
  user: userInfo;
  setUser: (user: userInfo) => void;
}

export const User = (props: UserProps) => {
  const { setStatus, user, setUser } = props;
  const [ edit, setEdit ] = useState<boolean>(false);
  const [ topUp, setTopUp ] = useState<boolean>(false);
  const refs: { [key:string]: RefObject<HTMLDivElement> } = {
    name: useRef<HTMLDivElement>(null),
    email: useRef<HTMLDivElement>(null),
    phone: useRef<HTMLDivElement>(null),
    gender: useRef<HTMLDivElement>(null),
    home: useRef<HTMLDivElement>(null),
    company: useRef<HTMLDivElement>(null),
    wallet: useRef<HTMLDivElement>(null),
  }
  const textMap = [
    {id: "name", label: "User name", user: user.name},
    {id: "email", label: "Email", user: user.email},
    {id: "phone", label: "Phone number", user: user.phone},
    {id: "gender", label: "Gender", user: user.gender},
    {id: "home", label: "Home address", user: user.home},
    {id: "company", label: "Company address", user: user.company},
    {id: "wallet", label: "Wallet", user: user.wallet}
  ]

  const Text = styled(TextField)({
    width: "275px",
    paddingBottom: "10px",
    input: {
      color: "#000000",
    },
    '#wallet-label': {
      color: (topUp)? "#313944" : "darkgrey",
      fontWeight: "bold",
    },
    label: {
      color: (edit)? "#313944" : "darkgrey",
      fontWeight: "bold",
    },
    '& .MuiSelect-select.Mui-disabled': {
      color: "#000000",
    },
  })

  const inputProps = {
    disabled: !edit,
    style: {
      fontSize: "14px",
    },
  }

  const walletProps = {
    disabled: !topUp,
    style: {
      fontSize: "14px"
    }
  }

  const editClick = () => {
    if(edit){
      setUser({
        ...user,
        name: refs["name"].current?.getElementsByTagName("input")[0].value ?? user.name,
        email: refs["email"].current?.getElementsByTagName("input")[0].value ?? user.email,
        phone: refs["phone"].current?.getElementsByTagName("input")[0].value ?? user.phone,
        gender: refs["gender"].current?.getElementsByTagName("input")[0].value ?? user.gender,
        home: refs["home"].current?.getElementsByTagName("input")[0].value ?? user.home,
        company: refs["company"].current?.getElementsByTagName("input")[0].value ?? user.company,
      })
    }
    setEdit(!edit);
  }

  const topUpClick = () => {
    if(topUp)
      refs["wallet"].current?.getElementsByTagName("input")[0].focus();
    setTopUp(!topUp);
  }

  return (
    <>
      {textMap.map(({ id, label, user }) => (
        (id === "gender")? 
        <Text
          select
          id={id}
          label={label}
          defaultValue={user}
          ref={refs[id]}
          variant="standard"
          InputProps={inputProps}
        >
          <SelectItem value={"Male"}>Male</SelectItem>
          <SelectItem value={"Female"}>Female</SelectItem>
          <SelectItem value={"Other"}>Other</SelectItem>
        </Text>
        :
        (id === "wallet")?
        <Text
          key={id}
          id={id}
          label={label}
          type="number"
          defaultValue={user}
          ref={refs[id]}
          variant="standard"
          InputProps={{...walletProps, startAdornment: <InputAdornment position="start">$</InputAdornment>}}
        />
        :
        <Text
          key={id}
          id={id}
          label={label}
          defaultValue={user}
          ref={refs[id]}
          variant="standard"
          InputProps={inputProps}
        />
      ))}
      <div style={{ width: "275px", display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginBottom: '5px' }}>
        <HalfButton variant="contained" onClick={() => editClick()}>{(edit)? "Update" : "Edit"}</HalfButton>
        <HalfButton variant="contained" onClick={() => topUpClick()}>{(topUp)? "Comfirm" : "Top up"}</HalfButton>
      </div>
      <MidButton variant="contained" onClick={() => setStatus("home")}>Back</MidButton>
    </>
  );
}