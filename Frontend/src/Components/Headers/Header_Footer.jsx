import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import {getBaseUrl} from '../../Utilities/getBaseUrl'

const Header_Footer = () => {
  return (
    <>
    <Header/>
        <Outlet/>
    <Footer/>
    </>
  )
}

export default Header_Footer