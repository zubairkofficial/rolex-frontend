import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Helpers from "../../Config/Helpers";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Addteam =({ activeTab, setActiveTab }) => {
  useEffect(() => {
    document.title = "Add Team Members - Crownsync AI";
    // Optionally, set meta description or any other head elements here
    return () => {
      // This is where you can reset or change the title when the component unmounts if necessary
      document.title = "Crownsync Ai";
    };
  }, []);
  const [user, setUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [inputuser , setInputUser] = useState('')
  const [input , setInput] = useState('')
  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const onUserInputChange = (event) => {
    setInputUser(event.target.value);
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if (activeTab === 'AddUser') {      
    fetchData();
    }
  }, [activeTab]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Helpers.apiUrl}userlist`, Helpers.authHeaders);
      if (response.status === 200) {
        setUser(response.data.data);
      } else {
        console.log("Error in getting user list");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Helpers.apiUrl}getuserlist`, Helpers.authHeaders);
        if (response.status === 200) {
          // Assuming response.data.data is an array of user objects
          setTeam(response.data.data); // Directly set the array of user objects to state
        } else {
          console.log("Error in getting user list");
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("user");
    const user = JSON.parse(username);

    const myuser = user ? user.name : null;
    const myid = user ? user.id : null;

    // console.log("Username", myuser);

    const payload = {
        user_id: myid,
        user_name: inputuser,
        user_email: input,
        
    };

    try {
        const response = await axios.post(`${Helpers.apiUrl}adduser`, payload, Helpers.authHeaders);
        if (response.status === 200) {
            console.log("Response data:", response.data);
            Helpers.toast("success", "Team Member Added Successfully");
            window.location.reload();
        } else {
            console.log("Operation not successful, response status:", response.status);
            Helpers.toast("error", response.status);
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            // console.error("An error occurred:", error.response.data.error);
            Helpers.toast("error", error.response.data.error);
        } else {
            console.error("An error occurred:", error.message);
            Helpers.toast("error", "An error occurred");
        }
    }
};

const handleDelete = async (templateId) => {
  try {
      const response = await axios.delete(`${Helpers.apiUrl}deluserlist/${templateId}`, Helpers.authHeaders);
      if (response.status === 200) {
          // toast.dismiss();
          Helpers.toast("success","Team Member Deleted Successfully");
          setTeam((prevTeam) =>
              prevTeam.filter((member) => member.id !== templateId)
          );
      }
  } catch (error) {
      // console.error("An error occurred during deletion:", error);
      // toast.dismiss();
      Helpers.toast("error","An error occurred during deletion");
  }
};
  

  return (
    <>
    <ToastContainer />
      <div
        className="container "
        style={{
          borderRadius: "20px",
          // background: "#F9F9F9",
          marginTop: "2%",
        }}
      >
        <div className="row  mt-5">
          <div className="col-md-6 p-7">
            <h1 className="py-5 text-3xl font-bold">Add Users in the Team</h1>
            <form  onSubmit={handleFormSubmit}>
            <div className="my-1">
              
              <input type="text" name="user_name" onChange={onUserInputChange} placeholder="User Name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  />
            </div>
            <div className="my-1">
                
                <input type="text"name="user_email" onChange={onInputChange} placeholder="User Email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  />
            </div>
             
            
             
              <br />
              <button
                type="submit"
                className="btn flex justify-end"
                style={{
                  background: "#E2545E",
                  color: "white",
                  marginRight: "1rem",
                }}
              >
                Add User
              </button>
            </form>
          </div>
          <div className="col-md-6 p-7">
            <div
              className="w-full p-4  border-gray-200 rounded-lg  sm:p-6 dark:border-gray-700"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold">
                  List of Users in the Team
                </h1>
              </div>
              <ul className="space-y-3">
                {team.map((member) => (
                  <li
                    key={member.id}
                    className="flex justify-between items-center bg-white shadow overflow-hidden rounded-lg"
                  >
                    <p className="p-4 text-gray-800 flex-grow">
                    {member.user_name} , {member.user_email}
                    </p>
                    <button
                      className="p-4"
                      onClick={() => handleDelete(member.id)}
                    >
                      <i className="fa-light fa-trash-can"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Addteam;
