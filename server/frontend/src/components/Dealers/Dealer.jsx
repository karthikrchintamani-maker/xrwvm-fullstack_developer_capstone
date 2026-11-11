
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const API = "http://localhost:3030";

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dealerRes, reviewRes] = await Promise.all([
          fetch(`${API}/fetchDealer/${id}`),
          fetch(`${API}/fetchReviews/dealer/${id}`)
        ]);

        if (!dealerRes.ok || !reviewRes.ok) {
          throw new Error("Unable to load dealership data");
        }

        const dealerData = await dealerRes.json();
        const reviewData = await reviewRes.json();

        setDealer(dealerData[0] || null);
        setReviews(reviewData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      {loading ? (
        <h3>Loading dealership...</h3>
      ) : !dealer ? (
        <h3>Dealership not found.</h3>
      ) : (
        <>
          <div style={{ marginTop: "20px" }}>
            <h1 style={{ color: "grey" }}>
              {dealer.full_name}
              {isLoggedIn && (
                <Link to={`/postreview/${id}`}>
                  <img
                    src={review_icon}
                    style={{
                      width: "55px",
                      marginLeft: "15px",
                      verticalAlign: "middle"
                    }}
                    alt="Write a Review"
                  />
                </Link>
              )}
            </h1>

            <h4 style={{ color: "grey" }}>
              {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
            </h4>
          </div>

          <div className="reviews_panel">
            {reviews.length === 0 ? (
              <h3>No reviews yet!</h3>
            ) : (
              reviews.map((review) => (
                <div className="review_panel" key={review.id}>
                  <img
                    src={senti_icon(review.sentiment)}
                    className="emotion_icon"
                    alt="Review sentiment"
                  />

                  <div className="review">
                    {review.review}
                  </div>

                  <div className="reviewer">
                    {review.name} &nbsp;
                    {review.car_make} {review.car_model} {review.car_year}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dealer;
