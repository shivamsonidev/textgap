import React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { Pane, TextInputField, Button, Text, toaster } from 'evergreen-ui'
import { auth, authErrors } from "../components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

async function tryLogin(email,password) {
  !(email && password) ? toaster.warning('Please fill in the details') :
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      toaster.success("Logged In");
    })
    .catch((error) => {
      const errorCode = error.code;
      toaster.warning(authErrors[errorCode]);
    });
}

export default function Login() {
  let [email, setEmail] = React.useState('')
  let [password, setPassword] = React.useState('')
  return (
    <Pane background="gray50" display="flex" alignContent="center" justifyContent="center" minHeight="100vh" paddingTop={60}>
      <Pane width={320}>
          <Pane display="flex" alignContent="center" justifyContent="center">
            <Image src="/logo.svg" alt="Vercel Logo" width={100} height={100} />
          </Pane>
          <Pane padding={30} marginY={30} border="default" width="100%" borderRadius={5} background="white">
              <TextInputField
                  id="username"
                  value={email}
                  label="Email Address"
                  type="email"
                  onChange={(e)=>setEmail(e.target.value)}
                  required
              />
              <TextInputField
                  id="password"
                  value={password}
                  label="Password"
                  type="password"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
              />
              <Button onClick={()=>tryLogin(email,password)} height={40} appearance="primary" intent="none">Login</Button>
          </Pane>
          <Pane><Link href="/password-forgot"><a><Text>Lost your password?</Text></a></Link></Pane>
          <Pane marginTop={10}><Link href="/"><a><Text>← Go to Website</Text></a></Link></Pane>
      </Pane>
    </Pane>
  )
}
