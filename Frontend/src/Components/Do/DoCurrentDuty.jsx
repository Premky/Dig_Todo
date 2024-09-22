import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NepaliDate from 'nepali-datetime'
import { getBaseUrl } from '../../Utilities/getBaseUrl'

const DoCurrentDuty = () => {
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [BASE_URL, setBase_Url] = useState();
  const getBaseURLFunc = async () => {
    const url = await getBaseUrl();
    setBase_Url(url)
  }
  // console.log(BASE_URL)

  useEffect(() => {
    getBaseURLFunc();
  }, []);

  const [currentDuties, setCurrentDuties] = useState([]);
  useEffect(() => {
    if (BASE_URL) {
      axios.get(`${BASE_URL}/auth/docurrentduty`)
        .then(response => {
          const duties = response.data.Result;
          const filteredDuties = filterCurrentDuties(duties);
          setCurrentDuties(filteredDuties);
        })
        .catch(error => {
          console.log("Error fetching duties:", error);
        });
    }
  }, [BASE_URL]);

  const filterCurrentDuties = (duties) => {
    const currentDate = new NepaliDate();
    const currentTime = currentDate.format('HH:mm');

    return duties.filter(duty => {
      const startDateTime = new NepaliDate(duty.start_date + ' ' + duty.start_time);
      const endDateTime = new NepaliDate(duty.end_date + ' ' + duty.end_time);

      return currentDate >= startDateTime && currentDate <= endDateTime;
    });
  };

  return (
    <>
      <div className="current-duty-container m-0 p-0 container-fluid">
      <div className="d-flex flex-column px-0 pt-0 " >
        <table className="table table-sm">
          <thead>
            <tr className='text-center table-primary'>
              {/* <th>सि.नं.</th> */}
              <th>डिउटी</th>
              <th>दर्जा नामथर</th>
              <th>सम्पर्क नं.</th>
              {/* <th>कैफियत</th> */}
            </tr>
          </thead>
          <tbody>
            {currentDuties.length > 0 ? (
              currentDuties.map((duty, index) => (
                <tr key={index} className='text-center'>
                  {/* <td>{index + 1}</td> */}
                  <td>{duty.dutytype === 1 ? 'फि.अ.' : duty.dutytype === 2 ? 'डि.अ.' : 'डि.अ. सहायक'}</td>
                  <td className=''>{duty.do_name}</td>
                  <td>{duty.contact}</td>
                  {/* <td>{duty.remarks}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No current duties</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </>
  )
}

export default DoCurrentDuty