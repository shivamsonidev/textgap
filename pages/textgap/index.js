import React from "react";
import Image from "next/image";
import Router from 'next/router'
import { Pane, Text, Button, DocumentIcon, PageLayoutIcon, VideoIcon, SettingsIcon, LogOutIcon, toaster } from "evergreen-ui";
import { auth, checkIfAccountExists } from "components/firebase";
import { onAuthStateChanged, signOut } from "@firebase/auth";

function Home() {

  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [companyIndex, setCompanyIndex] = React.useState("")
  const [tabs] = React.useState([
    {
      page: <div>x</div>,
      name: 'Posts',
      icon: DocumentIcon
    }, 
    {
      page: <div>y</div>,
      name: 'Pages',
      icon: PageLayoutIcon
    },
    {
      page: <div>z</div>,
      name: 'Media',
      icon: VideoIcon
    },
    {
      page: <div>a</div>,
      name: 'Settings',
      icon: SettingsIcon
    },
  ])

  return (
    <Pane display="flex" minHeight="100vh" flex-direction="column">

      <Pane padding={15} borderRight="default" background="gray50" width="10%" minWidth="100">
        <Pane display="flex" alignContent="center" gap={10} borderBottom="default" marginBottom={20} paddingBottom={20}>
          <Image src="/logo.svg" alt="Vercel Logo" width={30} height={30} />
          <Text size={500} alignSelf="center" color="#184b8f"><b>Textgap</b></Text>
        </Pane>
        {tabs.map((tab, index) => (
          <Button
            key={tab.name}
            id={tab.name}
            onClick={() => setSelectedIndex(index)}
            appearance={index === selectedIndex ? 'primary' : 'minimal'}
            width="100%"
            marginBottom={5}
            justifyContent="start"
            iconBefore={tab.icon}
          >
            {tab.name}
          </Button>
        ))}
        <Button appearance="minimal" width="100%" justifyContent="start" iconBefore={LogOutIcon} onClick={()=>{signOut(auth);toaster.warning('Logged out')}}>Logout</Button>
        <Text>{companyIndex}</Text>
      </Pane>

      <Pane>
        <Pane padding={16} >
          {tabs.map((tab, index) => (
            <Pane
              key={tab.name}
              id={`panel-${tab.name}`}
              role="tabpanel"
              aria-labelledby={tab.name}
              aria-hidden={index !== selectedIndex}
              display={index === selectedIndex ? 'block' : 'none'}
            >
              {tab.page}
            </Pane>
          ))}
        </Pane>
      </Pane>

    </Pane>
  )

}

export default function TextGapAdmin() {

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (typeof window !== "undefined") {
          Router.push('/textgap/login')
          window.location.href = '/textgap/login'
        }
      }
      else {
        checkIfAccountExists(user.uid)
        .then(result => !result && signOut(auth))
      }
    });

  })

  return (
    <Home />
  )
}
