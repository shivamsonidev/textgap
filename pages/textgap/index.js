import React from "react";
import Link from "next/link";
import { Pane, Text, Button, DocumentIcon, PageLayoutIcon, VideoIcon, SettingsIcon, LogOutIcon, toaster } from "evergreen-ui";
import Image from "next/image";
import {db, auth} from "components/firebase";
import { onAuthStateChanged, signOut } from "@firebase/auth";

export default function Home() {

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (typeof window !== "undefined") {
          window.location.href = '/textgap/login'
        }
      }
    });
  })

  const [selectedIndex, setSelectedIndex] = React.useState(0)
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

      <Pane padding={15} borderRight="default" background="tint2" width="10%" minWidth="100">
        <Pane display="flex" alignContent="center" gap={10} borderBottom="default" marginBottom={20} paddingBottom={20}>
          <Image src="/logo.svg" alt="Vercel Logo" width={30} height={30} />
          <Text size={500} alignSelf="center"><b>Textgap</b></Text>
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
