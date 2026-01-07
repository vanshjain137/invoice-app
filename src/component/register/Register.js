import React, { useRef, useState } from 'react'
import '../login/login.css'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const Register = () => {

    const fileInputRef = useRef(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [file, setFile] = useState(null)
    const [displayName, setDisplayName] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [isLoading, setLoading] = useState(false)

    const navigate = useNavigate()

    const onSelectFile = (e)=>{
        setFile(e.target.files[0])
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newUser = await createUserWithEmailAndPassword(auth, email, password)
            console.log("User created:", newUser.user)

            const date = new Date().getTime()
            let uploadedUrl = ""

            if (file) {
                const cleanName = displayName.replace(/\s+/g, "_")
                const publicId = `${cleanName}_${date}`

                const formData = new FormData()
                formData.append("file", file)
                formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
                formData.append("public_id", publicId)
                formData.append("folder", "invoice_app_users")

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData
                    }
                )

                const data = await res.json()
                uploadedUrl = data.secure_url
                console.log("Cloudinary URL:", uploadedUrl)
            }

            await updateProfile(newUser.user, {
                displayName: displayName,
                photoURL: uploadedUrl
            })

            setDoc(doc(db, "users", newUser.user.uid), {
                uid: newUser.user.uid,
                displayName: displayName,
                email: email,
                photoURL: uploadedUrl
            })
            navigate('/dashboard')
            setLoading(false)
            localStorage.setItem('cName', displayName)
            localStorage.setItem('photoURL', uploadedUrl)
            localStorage.setItem('email', newUser.user.email)
            localStorage.setItem('uid', newUser.user.uid)

        } catch (err) {
            setLoading(false)
            console.log("Error:", err)
        }
    }

    return (
        <div className='login-wrapper'>
            <div className='login-container'>
                <div className='login-box login-left'>

                </div>
                <div className='login-box login-right'>
                    <h2 className='login-heading'>Create Your Account</h2>
                    <form onSubmit={submitHandler}>
                        <input required onChange={(e) => { setEmail(e.target.value) }} className='login-input' type='text' placeholder='Email' />
                        <input required onChange={(e) => { setDisplayName(e.target.value) }} className='login-input' type='text' placeholder='Company Name' />
                        <input required onChange={(e) => { setPassword(e.target.value) }} className='login-input' type='password' placeholder='Password' />
                        <input required onChange={(e) => {onSelectFile(e)}} style={{ display: 'none' }} className='login-input' type='file' ref={fileInputRef} />
                        <input required className='login-input' type='button' value='Select Your Logo' onClick={() => { fileInputRef.current.click() }} />
                        {imageUrl != null && <img className='image-preview' src={imageUrl} alt="preview" />}
                        <button className='login-input login-btn' type="submit"> {isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Submit</button>
                    </form>
                    <Link to='/login' className='register-link'>Login With Your Account</Link>
                </div>
            </div>
        </div>
    )
}

export default Register

