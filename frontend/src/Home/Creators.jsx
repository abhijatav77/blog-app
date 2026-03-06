import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../utils/utils'

const Creators = () => {
  const [admin, setAdmin] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/users/admins`, {
        withCredentials: true,
      })
      console.log(data.admin)
      setAdmin(data.admin)
    }
    fetchData()
  }, [])
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-semibold mb-6'>Popular Creator</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 my-5'>
        {admin && admin.length > 0 ? (
          admin.slice(0, 4).map((element) => {
            return (
              <div key={element._id} className="flex flex-col items-center text-center">

                <img
                  src={element.photo.url}
                  alt={element.name}
                  className="w-40 h-40 sm:w-40 sm:h-40 md:w-52 md:h-52 object-cover rounded-full border"
                />

                <p className="mt-3 font-semibold text-lg">{element.name}</p>
                <p className="text-gray-500 text-sm">{element.role}</p>

              </div>
            )
          })
        ) : (<div></div>)}
      </div>
    </div>
  )
}

export default Creators