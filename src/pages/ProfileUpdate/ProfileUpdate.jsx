import React, { useContext, useEffect, useState } from 'react';
import './ProfileUpdate.css';
import avatar_icon from '../../assets/avatar_icon.png';
import logo_icon from '../../assets/logo_icon.png';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [uid, setUid] = useState('');
  const [prevImage, setPrevImage] = useState('');
  const {setUserData} = useContext(AppContext)

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const docRef = doc(db, 'users', uid);
      if (!uid) return;

      let avatarUrl = prevImage;

      if (image) {
        avatarUrl = await upload(image);
      }

      await updateDoc(doc(db, 'users', uid), {
        name,
        bio,
        avatar: avatarUrl,
      });

      setPrevImage(avatarUrl);

      toast.success('Profile updated successfully');
      const snap = await getDoc(docRef)
      setUserData(snap.data());
      navigate('/chat')
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }

      setUid(user.uid);

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setName(data.name || '');
          setBio(data.bio || '');
          setPrevImage(data.avatar || '');
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>

          <label htmlFor="avatar">
            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : prevImage || avatar_icon
              }
              alt="profile"
            />

            Upload Profile Image
          </label>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button type="submit">Save</button>
        </form>

        <img
          className="profile-pic"
          src={
            image
              ? URL.createObjectURL(image)
              : prevImage ? prevImage:logo_icon
          }
          alt="profile"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;