import React from 'react'
import { Navigate } from 'react-router-dom'


const SancharRoute = ({children}) => {
    return (
        localStorage.getItem("valid") && localStorage.getItem('type')=='संचार' || localStorage.getItem('type')=='सचिवालय' ? children : <Navigate to="/" />
    )
}



export default SancharRoute