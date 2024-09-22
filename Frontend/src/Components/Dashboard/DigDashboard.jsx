import React from 'react'
import Header from '../Headers/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Headers/Footer'
import AllPrograms from '../AllPrograms'
import LeaveCount from '../LeaveCount'
import DoCurrentDuty from '../Do/DoCurrentDuty'
import CurrentOfficerLeave from '../LeaveCount/CurrentOfficerLeave'
import ProgramList from './ProgramList'

const DigDashboard = () => {
    return (
        <>
            
            <div className='container-fluid'>
                <div className="row flex-nowrap">
                    <div className="col p-0 m-0" >
                        <div className="pb-1 pt-1 d-flex justify-content-center shadow bg-warning bg-gradient ">
                            <strong className=''> 
                                <h4>
                                    कार्यक्रम तालिका
                                </h4>                               
                            </strong>
                        </div>
                        <div className="div" style={{fontSize: 'calc(1vw + 0.20rem)'}}>
                            <ProgramList/>
                        </div>
                    </div>

                    <div className="col-auto col-md-4 col-xl-4 px-sm-1 px-o p-0 m-0">
                        <div className="d-flex flex-column px-0 pt-0 min-vh-100">
                            <div className="p-2 d-flex justify-content-center bg-primary shadow">
                                <h5 className='text-light'> <strong><u>आजको डिउटी</u></strong></h5>
                            </div>

                            <div className="col-12 pt-2 h6" style={{fontSize: 'calc(1vw + 0.20rem)'}}>
                                {/* <div className="pt-2"><strong>फिल्ड अधिकृतः</strong> </div> <hr />
                                <div className="pt-2"><strong>डिउटी अधिकृतः</strong></div> <hr />
                                <div className="pt-2"><strong>डिउटी सहायकः</strong></div> <hr /> */}
                                <DoCurrentDuty/>
                            </div>
                            <div className="col-12 pt-2 h6" style={{fontSize: 'calc(1vw + 0.20rem)'}}>
                                <LeaveCount/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
        </>
    )
}

export default DigDashboard