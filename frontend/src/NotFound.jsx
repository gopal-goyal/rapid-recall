// File: src/pages/NotFound.jsx
import{useEffects} from 'react';
import{useNavigate} from 'react-router-dom'

export default function NotFound(){
    const navigate = useNavigate();

    useEffect(() =>{
        //show-alert-and-then-redirect
        alert('page not found. Redirected to home.');
        navigate('/');
    },[navigate]);

    return null;
}