import { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import config from "../../config";
import { getBaseUrl } from "../../Utilities/getBaseUrl";


const ProgramList = () => {
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const [BASE_URL, setBase_Url] = useState();
    const getBaseURLFunc = async () => {
        const url = await getBaseUrl();
        setBase_Url(url)
    }
    useEffect(() => {
        getBaseURLFunc();
    }, []);

    const [programList, setProgramList] = useState([]);
    const [usertype, setUsertype] = useState('');
    const usr_branch_id = localStorage.getItem('bid');
    const org_id = localStorage.getItem('oid');

    // Fetch user type on component mount
    useEffect(() => {
        const storedUsertype = localStorage.getItem('type');
        if (storedUsertype) {
            setUsertype(storedUsertype);
        }
    }, []);

    // Fetch program list on component mount
    useEffect(() => {
        if (BASE_URL) {
            // if (org_id) {
            axios.get(`${BASE_URL}/auth/programs/${org_id}`)
                .then(result => {
                    if (result.data.Status) {
                        setProgramList(result.data.Result);
                    } else {
                        alert(result.data.Result);
                    }
                })
                .catch(err => console.error(err));
        }
        // }, [org_id]);
    });

    // Handle program deletion
    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/auth/delete_programs/${id}`)
            .then(result => {
                if (result.data.Status) {
                    setProgramList(prevList => prevList.filter(program => program.id !== id));
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error(err));
    };

    // Handle hiding a program
    const handleHide = (id) => {
        axios.put(`${BASE_URL}/auth/hide_programs/${id}`)
            .then(result => {
                if (result.data.Status) {
                    setProgramList(prevList => prevList.map(program =>
                        program.id === id ? { ...program, is_displayed: 0 } : program
                    ));
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.error(err));
    };

    // Format time
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const visiblePrograms = programList.filter(pl => pl.is_displayed === 1);

    return (
        <div className="d-flex flex-column px-0 pt-0">
            <table className='table table-striped p-0'>
                <thead className="bg-primary">
                    <tr>
                        <th className='bg-primary bg-gradient text-white'>सि.नं.</th>
                        <th className='bg-primary bg-gradient text-white'>मिति/समय</th>
                        <th className='bg-primary bg-gradient text-white'>कार्यक्रम</th>
                        <th className='bg-primary bg-gradient text-white'>स्थान</th>
                        <th className='bg-primary bg-gradient text-white'>आयोजक</th>
                        <th className='bg-primary bg-gradient text-white'>कै.</th>
                        {/* Additional actions could be added here */}
                    </tr>
                </thead>
                <tbody>
                    {visiblePrograms.map((pl, index) => (
                        pl.is_displayed === 1 && (
                            <tr key={pl.id}>
                                <td style={{ color: 'purple' }}>{index + 1}</td>
                                <td>
                                    {pl.date}<br />
                                    {pl.time && formatTime(pl.time)}
                                </td>
                                <td>{pl.program}</td>
                                <td>{pl.venue}</td>
                                <td>{pl.organizer}</td>
                                <td>{pl.remarks}</td>
                                {/* Add action buttons if needed */}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProgramList;
