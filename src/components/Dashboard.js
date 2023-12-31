import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./../css/Dashboard.css";
import LeftHeader from "./LeftHeader";
import FeedButton from "./FeedButton";
import NewOpportunityCard from "./NewOpportunityCard2";
import OldOpportunityCard from "./OldOpportunityCard";
// import NewOpportunityCardTop from "./NewOpportunityCardTop";
import { db } from "./Firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
// import NewOpportunityCardTop2 from "./NewOpportunityCardTop";

const Dashboard = () => {
  const [dataApplication, setDataApplication] = useState([]);
  const [dataForums, setDataForums] = useState([]);
  let navigate = useNavigate();

  if (localStorage.getItem("isLoggedIn") !== "true") {
    navigate("/login", { replace: true });
  }

  const fetchPostApplication = async () => {
    const querySnapshot = await getDocs(collection(db, "opportunities"));
    let data_list = [];
    const userMail = localStorage.getItem("usermail");
    const querySnapshot2 = await getDoc(doc(db, "people", userMail))
    const opportunities = querySnapshot2.data().opportunities;
    querySnapshot.forEach((doc) => {
      if(!opportunities.includes(doc.id)){
        let data_json = doc.data()
        data_json['doc_name'] = doc.id;
        var date1 = new Date(data_json["end_date"].seconds * 1000);
        var date2 = new Date();
        if (date2 <= date1){
          data_list.push(data_json);
        }
      }
    });
    setDataApplication(data_list);
  };

  const fetchPostForums = async () => {
    const querySnapshot = await getDocs(collection(db, "forums"));
    let data_list2 = [];
    querySnapshot.forEach((doc) => {
      data_list2.push(doc.data());
    });
    setDataForums(data_list2);
  };

  useEffect(() => {
    fetchPostApplication();
    fetchPostForums();
  }, []);

  // useEffect(()=>{
  //     fetchPostApplication();
  // },[])

  return (
    <div className="dashboardMain">
      <div style={{ position: "absolute", right: "50px" }}>
        <ProfileButton />
      </div>
      <div style={{ width: "228px" }}>
        <LeftHeader />
      </div>
      <div className="dashboardMainRight">
        {/* <div className="mainTop"></div> */}
        <div className="mainMiddle">
          {/* <NewOpportunityCardTop /> */}
          {/* <NewOpportunityCardTop /> */}
        </div>
        <div className="mainSecondMiddle">
          {dataApplication.map((item) => {
            return (
              <>
                <NewOpportunityCard info={item} />
              </>
            );
          })}
        </div>
        <div className="mainBottom">
          {dataForums.map((item) => {
            return (
              <>
                <OldOpportunityCard info={item} />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
