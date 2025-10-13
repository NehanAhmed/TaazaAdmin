import React from 'react'
import Signup from './components/Auth/Signup'
import Page from './app/dashboard/app'
// import { Route } from 'lucide-react'
// import Login from './components/Auth/Login'

import { Routes, Route } from 'react-router-dom'
import Success from './components/ui/Google/Succes'
import FailurePage from './components/ui/Google/Failure'
import Login from './components/Auth/Login'
import Page404 from './pages/404'
import { SettingsPage } from './pages/Settings'
import Dashboard from './pages/Dashboard'
const App = () => {
    return (
        <main className='w-full h-full'>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Page />} >
                    <Route path='/settings' element={<SettingsPage />} />
                    <Route path='/' element={<Dashboard />} />
                </Route>
                <Route path="/auth/success" element={<Success />} />
                <Route path="/auth/failure" element={<FailurePage />} />
                
                <Route path="*" element={<Page404 />} />
            </Routes>
        </main>
    )
}

export default App