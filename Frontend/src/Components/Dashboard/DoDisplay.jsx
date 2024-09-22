import React from 'react'
import DoHeader from '../Headers/DoHeader'
import Footer from '../Headers/Footer'
import LeaveCount from '../LeaveCount'
import AllPrograms from '../AllPrograms'
import DoDuties from '../Do/DoDuties'
import DoCurrentDuty from '../Do/DoCurrentDuty'
import DoNotice from '../Do/DoNotice'
import DoFooter from '../Headers/DoFooter'
import AddDoNotice from '../Do/AddDoNotice'
import ChiefProgramList from '../Do/ChiefProgramList'
import DoLeaveCount from '../Do/DoLeaveCount'
import ProgramList from './ProgramList'



const DoDisplay = () => {
    return (
        <>

            <div className="row p-0 m-0">
                <div className="col-6 p-0 m-0">
                    <div className="pt-2 d-flex justify-content-center  bg-gradient ">
                        <DoNotice />
                    </div>
                    <div>
                    </div>

                </div>
                <div className="col-6">
                    <div className="row" style={{ fontSize: '0.8rem' }}>
                        <div className="pt-1 d-flex justify-content-center shadow bg-warning bg-gradient ">
                            <strong className=''>
                                <h6>  आजको डिउटी    </h6>
                            </strong>
                        </div>
                        <DoCurrentDuty />
                    </div>
                    <div className="row" style={{ fontSize: '0.6rem' }}>
                    <div className="pt-1 d-flex justify-content-center shadow bg-warning bg-gradient ">
                            <h6 > <strong> बिदामा रहेका प्रहरी कर्माचारीहरुको संख्या</strong></h6>
                        </div>
                        {/* <LeaveCount /> */}
                        <DoLeaveCount />
                    </div>

                    <div className="row" style={{ fontSize: '0.6rem' }}>
                        <div className="pt-1 d-flex justify-content-center shadow bg-warning bg-gradient ">
                            <strong className='' >
                                <h6>  कार्यलय प्रमुखको कार्यक्रम </h6>
                            </strong>
                        </div>
                        <ProgramList/>
                    </div>

                </div>
            </div>


        </>
    )
}

export default DoDisplay