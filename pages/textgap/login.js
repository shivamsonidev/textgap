import React from "react";
import Link from "next/link";
import Image from "next/image";
import Router from 'next/router'
import { Pane, TextInputField, Button, Text, toaster, DoughnutChartIcon } from "evergreen-ui";
import { auth, authErrors } from "components/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "@firebase/auth";

async function tryLogin(email, password) {
  !(email && password)
    ? toaster.warning("Please fill in the details")
    : signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          toaster.success("Logged In");
          Router.push('/textgap')
        })
        .catch((error) => {
          const errorCode = error.code;
          toaster.warning(authErrors[errorCode]);
        });
}

async function tryLoginWithGoogle() {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log(user.uid)
    toaster.success("Logged in");
  }).catch((error) => {
    toaster.warning(authErrors[error.code]);
  });
}

export default function Login() {
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  return (
    <Pane background="gray50" display="flex" alignContent="center" justifyContent="center" minHeight="100vh" paddingTop={60}>
      <Pane width={320}>
        <Pane display="flex" alignContent="center" justifyContent="center">
          <Image src="/logo.svg" alt="Vercel Logo" width={100} height={100} />
        </Pane>
        <Pane padding={30} marginY={30} border="default" width="100%" borderRadius={5} background="white">
          <TextInputField id="username" value={email} label="Email Address" type="email" onChange={(e) => setEmail(e.target.value)} required />
          <TextInputField id="password" value={password} label="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
          <Button onClick={() => tryLogin(email, password)} height={40} width="100%" appearance="primary" intent="none">Login</Button>
          <Pane marginTop={30}>
            <Button iconBefore={DoughnutChartIcon} height={40} width="100%" intent="none" onClick={()=>tryLoginWithGoogle()}>Login through Google</Button>
          </Pane>
        </Pane>
        <Pane display="flex" justifyContent="space-between">
          <Link href="/textgap/password-forgot"><a><Text>Lost your password?</Text></a></Link>
          <Link href="/textgap/signup"><a><Text>Sign up</Text></a></Link>
        </Pane>
        <Pane marginTop={10}>
          <Link href="/"><a><Text>← Go to Website</Text></a></Link>
        </Pane>
      </Pane>
    </Pane>
  );
}