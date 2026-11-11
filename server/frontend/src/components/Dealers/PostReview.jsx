import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let firstname = sessionStorage.getItem("firstname");
    let lastname = sessionStorage.getItem("lastname");
    let name = (firstname && firstname !== "null" ? firstname : "") + " " + (lastname && lastname !== "null" ? lastname : "");
    name = name.trim();

    if (!name) {
      name = sessionStorage.getItem("username");
    }

    if (!name) {
      alert("Please log in to post a review");
      return;
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" ");

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    } else {
      alert("Failed to post review: " + (json.message || "Unauthorized"));
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if (retobj.status === 200 && retobj.dealer) {
      if (Array.isArray(retobj.dealer)) {
        if (retobj.dealer.length > 0) setDealer(retobj.dealer[0]);
      } else {
        setDealer(retobj.dealer);
      }
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if (retobj.CarModels) {
      setCarmodels(Array.from(retobj.CarModels));
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name || dealer.name}</h1>
        <textarea
          id='review'
          cols='50'
          rows='7'
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <div className='input_field' style={{ marginTop: "10px" }}>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className='input_field' style={{ marginTop: "10px" }}>
          Car Make 
          <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)} defaultValue="">
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, index) => (
              <option key={index} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>        
        </div>

        <div className='input_field' style={{ marginTop: "10px" }}>
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2026} min={2015} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;