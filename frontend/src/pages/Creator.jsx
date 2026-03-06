import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/utils'

const Creator = () => {
  const [creators, setCreators] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/users/admins`, {
        withCredentials: true
      })
      console.log(data.admin)
      setCreators(data.admin)
    }
    fetchData()
  }, [])
  return (
    <div className='flex flex-wrap justify-center items-center my-20 bg-gray-100'>
        {creators.map((creator) => (
            <div
              key={creator._id}
              className='bg-white shadow-lg rounded-lg overflow-hidden max-w-xs w-full m-2'
            >
              <div className='relative'>
                <img src={creator.photo.url} alt="avatar" className="w-full h-56 object-cover" />
                <div className='absolute inset-x-0 top-35 transform translate-y-1/2'>
                  <img src={creator.photo.url} alt="avatar"  className="w-20 h-20 rounded-full mx-auto border-4 border-gray-700"/>
                </div>
                <div className='px-4 py-6 mt-3'>
                  <h2 className='text-center text-xl font-semibold text-gray-800'>{creator.name}</h2>
                  <p className='text-center text-gray-600 mt-2'>{creator.email}</p>
                  <p className='text-center text-gray-600 mt-2'>{creator.phone}</p>
                  <p className='text-center text-gray-600 mt-2'>{creator.role}</p>
                </div>
              </div>
            </div>
          )
        )}
    </div>
  )
}

export default Creator