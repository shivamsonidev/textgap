import React from "react";
import Link from "next/link";
import Image from "next/image";
import Router from 'next/router'
import { Pane, TextInputField, Button, Text, toaster, DoughnutChartIcon, Spinner } from "evergreen-ui";
import { auth, authErrors, createAccount, checkIfAccountExists, createDocument } from "components/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "@firebase/auth";

async function trySignupWithPassword(email, password) {
  if (password.length < 8) {
    toaster.warning("Your password must be at least 8 characters"); 
    return;
  }
  if (password.search(/[a-z]/i) < 0) {
    toaster.warning("Your password must contain at least one letter.");
    return;
  }
  if (password.search(/[0-9]/) < 0) { 
    toaster.warning("Your password must contain at least one digit."); 
    return;
  }

  !(email && password)
    ? toaster.warning("Please fill in the details") 
    : createUserWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        const user = userCredential.user;
        toaster.success("Signed up!");
        try {
          const account = await createAccount(user.uid, email)
          if(account) {
            Router.push('/textgap')
            toaster.success("Account created successfully");
          }
          else {}
        }
        catch(err) {
          toaster.warning(err)
        }
        return;
      })
      .catch((error) => {
        toaster.warning(authErrors[error.code]);
      });
}

async function trySignupWithGoogle() {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
  .then(async (result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    try {
      const flag = await checkIfAccountExists(user.uid)
      if(!flag) {
        await createDocument(user.uid, user.email)
      }
      Router.push('/textgap')
      toaster.success("Account created successfully");
    }
    catch (err) {
      toaster.warning("Could not connect to database")
    }

    toaster.success("Logged in");
  }).catch((error) => {
    toaster.warning(authErrors[error.code]);
  });
}

export default function Signup() {
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [loading, setLoading] = React.useState(false);

  return (
    <Pane background="gray50" display="flex" alignContent="center" justifyContent="center" minHeight="100vh" paddingTop={60}>
      <Pane width={320}>
        <Pane display="flex" alignContent="center" justifyContent="center">
          <Image src="/logo.svg" alt="Vercel Logo" width={100} height={100} />
        </Pane>
        <Pane padding={30} marginY={30} border="default" width="100%" borderRadius={5} background="white">
          <TextInputField id="username" value={email} label="Email Address" type="email" onChange={(e) => setEmail(e.target.value)} required />
          <TextInputField id="password" value={password} label="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
          {loading ? 
          <Button disabled={true} height={40} width="100%" intent="none"><Spinner size={16} /></Button> : 
          <Button onClick={async() => {setLoading(true); await trySignupWithPassword(email, password).then(()=>setLoading(false))}} height={40} width="100%" appearance="primary" intent="none">Signup</Button>}
          <Pane marginTop={30}>
            <Button iconBefore={DoughnutChartIcon} height={40} width="100%" intent="none" onClick={()=>trySignupWithGoogle()}>Signup through Google</Button>
          </Pane>
        </Pane>
        <Pane display="flex" justifyContent="space-between">
          <Link href="/textgap/password-forgot"><a><Text>Lost your password?</Text></a></Link>
          <Link href="/textgap/login"><a><Text>Already a user?</Text></a></Link>
        </Pane>
        <Pane marginTop={10}>
          <Link href="/"><a><Text>← Go to Website</Text></a></Link>
        </Pane>
      </Pane>
    </Pane>
  );
}