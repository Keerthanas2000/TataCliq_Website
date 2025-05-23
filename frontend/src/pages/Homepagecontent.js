import React from "react";
import { Card, Grid } from "@mui/material";

import Carousel from "./Carousel";
import lighning from "../images/lighning.png";

function Homepagecontent() {
  const images = [
    "https://assets.tatacliq.com/medias/sys_master/images/65244458582046.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458647582.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458713118.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458909726.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244458975262.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244459040798.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244459106334.png",
    "https://assets.tatacliq.com/medias/sys_master/images/65244459597854.png",
  ];

  const Dealsimages = [
    "https://assets.tatacliq.com/medias/sys_master/images/65236469383198.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469448734.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469514270.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469579806.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469645342.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469710878.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469776414.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469841950.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469907486.jpg",
    "https://assets.tatacliq.com/medias/sys_master/images/65236469973022.jpg",
  ];

  const handleCardClick = (imageUrl, index) => {
    console.log(`Card ${index + 1} clicked: ${imageUrl}`);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        marginTop={15}
        justifyContent="center"
        alignItems="center"
      >
        <Grid size={12} margin={2}>
          <Carousel />{" "}
        </Grid>{" "}
        <Grid size={12} margin={2}>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              padding: "1rem",
            }}
          >
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="hover-card"
                onClick={() => handleCardClick(imageUrl, index)}
                style={{
                  width: "200px",
                  height: "150px",
                  marginRight: "1rem",
                  overflow: "hidden",
                  border: "none",
                  borderRadius: "18px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Card ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/64684496584734.jpg"
                alt="Image 1"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>{" "}
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/65199475851294.jpg"
                alt="Image 3"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/65199475785758.jpg"
                alt="Image 2"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/64684495831070.jpg"
                alt="Image 4"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
            <div>
              <img
                src="https://assets.tatacliq.com/medias/sys_master/images/64684495831070.jpg"
                alt="Image 4"
                style={{ width: "100%", height: "auto", maxWidth: "300px" }}
              />
            </div>
          </div>

          <div
            style={{
              paddingTop: "30px",
              paddingBottom: "20px",
              textAlign: "center",
            }}
          >
            <img
              src={lighning}
              style={{
                width: "50%",
                height: "80px",
              }}
            />{" "}
          </div>

          <style>{`
        .hover-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
        </Grid>{" "}
        {Dealsimages.map((imageUrl, index) => (
          <Grid size={6} key={index} justifyContent={"center"}>
            <Card
              className="hover-card"
              onClick={() => handleCardClick(imageUrl, index)}
              style={{
                width: "80%",
                height: "400px",
                margin: "10%",
                borderRadius: "8px",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
            >
              <img
                src={imageUrl}
                alt={`Deal ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Homepagecontent;
