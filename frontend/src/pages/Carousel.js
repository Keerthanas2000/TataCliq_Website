import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Carousel() {
  useEffect(() => {
    const carousel = document.getElementById("carouselExampleControls");
    if (carousel) {
      carousel.addEventListener("slide.bs.carousel", () => {
        const activeItem = carousel.querySelector(".carousel-item.active");
        if (activeItem) {
          const activeCaption = activeItem.querySelector(".carousel-caption");
          if (activeCaption) activeCaption.classList.remove("fade-in");
        }
      });

      carousel.addEventListener("slid.bs.carousel", () => {
        const activeItem = carousel.querySelector(".carousel-item.active");
        if (activeItem) {
          const activeCaption = activeItem.querySelector(".carousel-caption");
          if (activeCaption) activeCaption.classList.add("fade-in");
        }
      });

      const firstCaption = carousel.querySelector(
        ".carousel-item.active .carousel-caption"
      );
      if (firstCaption) firstCaption.classList.add("fade-in");
    }
  }, []);

  return (
    <div
      id="carouselExampleControls"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://assets.tatacliq.com/medias/sys_master/images/65236471742494.png"
            className="d-block w-100"
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>
        <div className="carousel-item">
          <img
            src="https://assets.tatacliq.com/medias/sys_master/images/65236471873566.png"
            className="d-block w-100"
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>
        <div className="carousel-item">
          <img
            src="https://assets.tatacliq.com/medias/sys_master/images/65236471939102.png"
            className="d-block w-100"
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>

         <div className="carousel-item">
          <img
            src="https://assets.tatacliq.com/medias/sys_master/images/65236472004638.png"
            className="d-block w-100"
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>

         <div className="carousel-item">
          <img
            src="https://assets.tatacliq.com/medias/sys_master/images/65236472070174.png"
            className="d-block w-100"
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>

         <div className="carousel-item">
          <img
            src="https://assets.tatacliq.com/medias/sys_master/images/65236471611422.png"
            className="d-block w-100"
            alt="..."
          />
          <div className="carousel-caption d-none d-md-block"></div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
