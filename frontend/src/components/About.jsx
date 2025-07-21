import {Link, useParams, useSearchParams} from 'react-router-dom'

export default function About(){
    const params = useParams();
    console.log(params)


    return(
        <>
        <h1>About Page</h1>
        <Link to="/">Home</Link>
        </>

    )


}