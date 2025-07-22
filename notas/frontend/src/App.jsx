import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

    return(
        <>
            <BrowserRouter>
                <Routes>

                        <Route path="/about" element={
                            <ProtectedRoute>
                             <About />
                            </ProtectedRoute>
                            }>
                        </Route>

                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />}/>
                            <Route path="/about" element={<About />} />
                        </Route>
                
                    <Route path="*" element={<p>Page not found</p>}/>
                </Routes>
            </BrowserRouter>
        
        
        
        </>
    )
}
