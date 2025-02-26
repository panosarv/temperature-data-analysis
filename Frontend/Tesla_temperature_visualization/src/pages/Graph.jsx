import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DataPerMonthGraph from '../components/DataPerMonthGraph'
import DataPerYearGraph from '../components/DataPerYearGraph'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

function Graph() {
    const navigateToAccessDenied = useNavigate()
    const checkIfUserIdIsSet = () => {
        const userId = sessionStorage.getItem("user_id")
        if (!userId) {
            navigateToAccessDenied('/access-denied')
        }
    }
    useEffect(() => {
        checkIfUserIdIsSet()
    }, [])
    return (
        <>
        <Button className='absolute top-10 left-10 rounded-full bg-anthracite' variant='primary' onClick={()=>{window.location.href='/'}}><ChevronLeft className='text-white'/></Button>
        <div className='bg-white-100 w-[60vw] rounded-lg shadow-lg border flex items-center justify-center flex-col  px-2' style={{background:'white'}}>
            <div className='w-full border rounded-lg shadow-lg m-1'>
            <DataPerMonthGraph style></DataPerMonthGraph>
            </div>
            <div className='w-full border rounded-lg shadow-lg m-1'>
            <DataPerYearGraph></DataPerYearGraph>
            </div>
        </div>
        </>
    )
}
export default Graph