import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast, Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { useReactMediaRecorder } from "react-media-recorder";
import CaptchaTest from './captcha';

import './element.css'
import { verifyPassword } from '../helper/helper'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { passwordValidate } from '../helper/validate'
import avatar from '../assets/profile.jpg'
import styles from '../styles/Username.module.css'

function Password() {

    const navigate = useNavigate();
    const {username} = useAuthStore(state => state.auth)
    const[{isLoading, apiData, serverError}] = useFetch(`/user/${username}`)

    const [URL, setURL] = useState();

    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ video: true });

    const onClick = () => {
        const url = mediaBlobUrl;
        setURL(url);
        console.log(url);
    }

    const formik = useFormik({
        initialValues: {
            password: '',
            url: ''
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, {url :URL})
            console.log(values);
            let loginPromise = verifyPassword({username, password : values.password})
            //let loginPromise = verifyPassword(username)
            toast.promise(loginPromise, {
                loading: 'Checking...',
                success: <b>Login Successfully !!!</b>,
                error: <b>Password didn't match!</b>
            });
            loginPromise.then(res => {
                let {token} = res.data;
                localStorage.setItem('token',token);
                console.log(values)
                navigate('/profile')
            })
        }
    })

    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className='flex justify-center items-center h-fit'>
            <div className={styles.glass}>

                <div className='title flex flex-col items-center'>
                    <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Long time no see !!!
                    </span>
                </div>

                <form className='py-1'>
                    <div className='profile flex justify-center py-4'>
                        <img src={apiData?.profile || avatar} alt="avatar" className={styles.profile_img}/>
                    </div>

                    <br></br>

                    <div className='textbox flex flex-col items-center gap-6'>
                        <label htmlFor='password' className='text-center text-gray-500'>Enter your password to Log in</label>
                        <input {...formik.getFieldProps('password')} className={styles.textbox} type= "text" placeholder="Password"/>
                    </div>
                </form>

                <div>

                    <br></br>

                    <p className='text-center text-gray-500'>Status : {status}</p>
                    <br></br>

                    <video src={mediaBlobUrl} controls autoPlay loop />                    <br></br>
                    <p className='text-center text-gray-500'> Read out the Captcha while recording your video.</p>

                    <span>
                        <CaptchaTest />
                    </span>

                    <br></br><br></br>

                    <button className={styles.btn} style={{width:'180px', marginRight:'10px'}} onClick={startRecording}>Start Recording</button>
                    <button className={styles.btn} style={{width:'180px', marginLeft:'40px', marginRight:'40px'}} onClick={stopRecording}>Stop Recording</button>
                    <button className={styles.btn} style={{width:'180px', marginLeft:'10px'}} onClick={onClick}>save</button>
                
                </div>

                <br></br>

                <button onClick={formik.handleSubmit} style={{width:'646px'}} className={`${styles.btn}`} type='submit'>Log in</button>


                <div className='text-center py-4'>
                        <span className='text-gray-500'>Forgot Password?<Link to='/recovery' className='text-red-500'> Recover now </Link></span>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Password