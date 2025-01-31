import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getNav } from '../navigation/index'
import { IoLogOutOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch()
  const { role } = useSelector((state) => state.auth)

  const [allNav, setAllNav] = useState([])
  const { pathname } = useLocation()

  useEffect(() => {
    const navs = getNav(role)
    setAllNav(navs)
  }, [role])

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('access_token')
    Cookies.remove('access_token')
    window.location.href = '/auth/login'
  }

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? 'invisible' : 'visible'
        } w-screen h-screen bg-[#415c7480] top-0 left-0 z-10`}
      ></div>
      <div
        className={`w-[260px] fixed bg-[#e6e7fb] z-50 top-0 h-screen
        shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${
          showSidebar ? 'left-0' : '-left-[260px] lg:left-0'
        }`}
      >
        <div className="h-[70px] flex justify-center items-center">
          <Link to="/" className="w-[180px] h-[50px]">
            {/* <img className="w-full h-full" src="./public/images/logo.png" alt="logo" /> */}
            <h1>ProsLight</h1>
          </Link>
        </div>

        <div className="px-[16px] ">
          <ul>
            {allNav.map((n, i) => (
              <li key={i}>
                <Link
                  to={n.path}
                  className={`${
                    pathname === n.path
                      ? 'bg-blue-600 shadow-indigo-500/50 text-white duration-500'
                      : 'text-[#030811] font-bold duration-200'
                  } px-[12px] py-[9px] rounded-sm flex
                  justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1 `}
                >
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                className="text-[#030811] font-bold duration-200
                  px-[12px] py-[9px] rounded-sm flex
                  justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1"
              >
                <span>
                  <IoLogOutOutline />
                </span>
                <span onClick={handleLogout}>Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
