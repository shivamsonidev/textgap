import CustomHead from '../components/Head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { Pane, TextInputField, Button, Text } from 'evergreen-ui'

export default function Login() {
  return (
    <Pane className={styles.container} background="gray50">
      <CustomHead title="Login" />
      <main className={styles.main}>
        <Pane width={320}>
            <Pane display="flex" alignContent="center" justifyContent="center">
                <Pane width={100} backgroundImage="url('./logo.svg')" backgroundSize="cover" height={100} />
            </Pane>
            <Pane padding={30} marginY={30} border="default" width="100%" borderRadius={5} background="white">
                <TextInputField
                    id="username"
                    label="Username or Email Address"
                    required
                />
                <TextInputField
                    id="password"
                    label="Password"
                    type="password"
                    required
                />
                <Button height={40} appearance="primary" intent="none">Login</Button>
            </Pane>
            <Pane><Link href="/password-forgot"><a><Text>Lost your password?</Text></a></Link></Pane>
            <Pane marginTop={10}><Link href="/"><a><Text>← Go to Website</Text></a></Link></Pane>
        </Pane>
      </main>
    </Pane>
  )
}
