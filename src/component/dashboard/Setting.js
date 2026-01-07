import React, { useRef, useState } from 'react'
import { auth, db } from '../../firebase'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

const Setting = () => {
  const fileInputRef = useRef(null)
  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [password, setPassword] = useState('')
  const [file, setFile] = useState(null)
  const [displayName, setDisplayName] = useState(localStorage.getItem('cName'))
  const [imageUrl, setImageUrl] = useState(localStorage.getItem('photoURL'))
  const [isLoading,setLoading] = useState(false)

  const updateCompanyName = () => {
    updateProfile(auth.currentUser, {
      displayName: displayName
    })
      .then(res => {
        localStorage.setItem('cName', displayName)
        updateDoc(doc(db, "users", localStorage.getItem('uid')), {
          displayName: displayName
        })
          .then(res => {
            window.location.reload()
          })
      })
  }

  const onSelectFile = (e) => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const updateLogo = async () => {
    setLoading(true)
    if (!file) {
      alert("Please select a new image first")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      formData.append("folder", "invoice_app_users")

      console.log("Uploading new image to Cloudinary...");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )
      const data = await res.json()

      if (data.error) {
        console.error("Cloudinary Error:", data.error.message);
        alert("Upload Failed: " + data.error.message);
        return;
      }

      const newUrl = data.secure_url
      console.log("New Image URL:", newUrl);

      const uid = localStorage.getItem('uid')
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: newUrl })
      }

      const userRef = doc(db, "users", uid)
      await updateDoc(userRef, { photoURL: newUrl })

      localStorage.setItem('photoURL', newUrl)

      alert("Profile picture updated successfully!")
      setLoading(false)
      window.location.reload()

    } catch (error) {
      setLoading(false)
      console.error("Firebase/Update Error:", error)
      alert("Failed to update database. Check console.")
    }
  }

  return (
    <div>
      <h2>Setting</h2>
      <div className='setting-wrapper'>
        <div className='profile-info update-cName'>
          <img onClick={() => { fileInputRef.current.click() }} className='pro' alt="profile-pic" src={imageUrl} />
          <input onChange={(e) => { onSelectFile(e) }} style={{ display: 'none' }} type='file' ref={fileInputRef} />
          {file && <button onClick={() => { updateLogo() }} style={{width:'30%', padding:'10px', backgroundColor:'#f95800'}}> {isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Update Profile Pic</button>}
        </div>

        <div className='update-cName'>
          <input onChange={e => { setDisplayName(e.target.value) }} type="text" placeholder='Company Name' value={displayName} />
          <button onClick={updateCompanyName}>Update Company Name</button>
        </div>
      </div>
    </div>
  )
}

export default Setting
