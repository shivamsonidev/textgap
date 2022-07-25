import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Pane, TextInputField, Button, Text, toaster, MobilePhoneIcon, DoughnutChartIcon } from "evergreen-ui";
import { auth, authErrors } from "../components/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

async function trySignup(email, password) {
  if (password.length < 8) {
    toaster.warning("Your password must be at least 8 characters"); 
    return false;
  }
  if (password.search(/[a-z]/i) < 0) {
    toaster.warning("Your password must contain at least one letter.");
    return false;
  }
  if (password.search(/[0-9]/) < 0) { 
    toaster.warning("Your password must contain at least one digit."); 
    return false;
  }

  !(email && password)
    ? toaster.warning("Please fill in the details") 
    : createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid)
        toaster.success("Signed up!");
      })
      .catch((error) => {
        toaster.warning(authErrors[error.code]);
      });
}

export default function Signup() {
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  return (
    <Pane background="gray50" display="flex" alignContent="center" justifyContent="center" minHeight="100vh" paddingTop={60}>
      <Pane width={320}>
        <Pane display="flex" alignContent="center" justifyContent="center">
          <Image src="/logo.svg" alt="Vercel Logo" width={100} height={100} onClick={()=>signOut(auth)} />
        </Pane>
        <Pane padding={30} marginY={30} border="default" width="100%" borderRadius={5} background="white">
          <TextInputField id="username" value={email} label="Email Address" type="email" onChange={(e) => setEmail(e.target.value)} required />
          <TextInputField id="password" value={password} label="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
          <Button onClick={() => trySignup(email, password)} height={40} appearance="primary" intent="none">Signup</Button>
          <Pane marginTop={30}>
            <Link href="/signup-mobile"><Button iconBefore={MobilePhoneIcon} height={40} width="100%" intent="none">Signup through Phone</Button></Link>
          </Pane>
          <Pane marginTop={10}>
            <Link href="/signup-google"><Button iconBefore={DoughnutChartIcon} height={40} width="100%" intent="none">Signup through Google</Button></Link>
          </Pane>
        </Pane>
        <Pane display="flex" justifyContent="space-between">
          <Link href="/password-forgot"><a><Text>Lost your password?</Text></a></Link>
          <Link href="/login"><a><Text>Already a user?</Text></a></Link>
        </Pane>
        <Pane marginTop={10}>
          <Link href="/"><a><Text>← Go to Website</Text></a></Link>
        </Pane>
      </Pane>
    </Pane>
  );
}