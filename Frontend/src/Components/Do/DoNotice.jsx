import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './doNotice.css';
import { getBaseUrl } from '../../Utilities/getBaseUrl'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Ensure this is imported

const DoNotice = () => {
  // const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [BASE_URL, setBase_Url] = useState();
  const getBaseURLFunc = async () => {
    const url = await getBaseUrl();
    setBase_Url(url)
  }

  useEffect(() => {
    getBaseURLFunc();
  }, []);

  const [doNotice, setDoNotice] = useState([]);

  const fetchDoNotices = () => {
    axios
      .get(`${BASE_URL}/auth/display_do_notice`)
      .then((result) => {
        if (result.data.Status) {
          // console.log(result.data.Result);
          setDoNotice(result.data.Result);
        } else {
          console.log(result.data.result);
          alert(result.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (BASE_URL) {
      // console.log('Base_url is set now')
      fetchDoNotices();
    } else {
      // console.log('Base_url not set yet')
    }
  }, [BASE_URL]);

  return (
    <>
      <Carousel
        autoPlay={true}
        interval={9000}
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={true}
        dynamicHeight={true}
      >

        {doNotice.map((e, index) => (
          <div key={index} style={{ height: '100vh' }}>
            <img
              src={`${BASE_URL}/Uploads/${e.notice_img}`}
              alt='Notice'
              // style={{ width: '55%', height: '75%' }}
              className='d-block  carousel-image'
            />

          </div>
        ))}
      </Carousel>

    </>
  )
}

export default DoNotice