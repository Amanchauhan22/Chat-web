import React, { useContext, useEffect, useState } from "react";
import "./LeftSideBar.css";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu_icon.png";
import search_icon from "../../assets/search_icon.png";
import profile_richard from "../../assets/profile_richard.png";
import { AppContext } from "../../context/AppContext";
const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addChat = async () => {
    if (creatingChat) return;
    setCreatingChat(true);
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");

    const currentUserChatRef = doc(db, "chats", userData.id);
    const chatDoc = await getDoc(currentUserChatRef);

    const existingChats = chatDoc.exists()
      ? chatDoc.data().chatsData || []
      : [];

    const alreadyExists = existingChats.some((chat) => chat.rId === user.id);


    if (alreadyExists) {
      setMessagesId(alreadyExists.messageId);

      const uSnap = await getDoc(doc(db, "users", user.id));

      setChatUser({
        ...alreadyExists,
        userData: uSnap.data(),
      });

      setShowSearch(false);
      setChatVisible(true);
      return;
    }
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChatUser({
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData,
      });
      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      console.error(error);
    }
    setCreatingChat(false);
  };
  const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
    const userChatsRef = doc(db, "chats", userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();
    const chatIndex = userChatsData.chatsData.findIndex(
      (c) => c.messageId === item.messageId,
    );
    userChatsData.chatsData[chatIndex].messageSeen = true;
    await updateDoc(userChatsRef, {
      chatsData: userChatsData.chatsData,
    });
    setChatVisible(true);
  };
  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser((prev) => ({ ...prev, userData: userData }));
      }
    };
    updateChatUserData();
  }, [chatData]);

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={logo} className="logo" alt="" />
          <div className="menu">
            <img src={menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div></div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}
            >
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
