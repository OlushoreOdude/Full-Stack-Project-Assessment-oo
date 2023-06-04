import { useState, useEffect } from "react";
import styled from "styled-components";
import VideoForm from "./VideoSubForm";
import VideoCard from "./VideoCard";
//import exampleresponse from "./exampleresponse.json";

const VideoApp = () => {
  const API = "http://127.0.0.1:5000/";
  const getAPI = () => {
    // Change this endpoint to whatever local or online address you have
    // Local PostgreSQL Database

    fetch(`${API}videos`)
      .then((response) => {
        //console.log(response);
        return response.json();
      })
      .then((data) => {
        //setApiData(data);
        setVideos(data.videoes);
        setLoading(false);
        console.log(data);
        console.log(data.videoes);
      });
  };
  useEffect(() => {
    getAPI();
  }, []);
  /* const [apiData, setApiData] = useState([]); */
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState(false);
  //console.log(apiData, "all videos ");
  const [videos, setVideos] = useState([]);
  console.log(videos, "videoes");
  //const [videos, setVideos] = useState([...exampleresponse]);

  function addLike(param) {
    const updatedLikes = videos.filter((el) => el.id !== param);
    console.log({ updatedLikes });
    const newLike = videos.filter((el) => el.id === param);
    console.log({ newLike });

    //console.log(newLike[0], "befor change");
    newLike[0].rating++;
    //console.log(newLike[0], "after change");
    // - - need to sort array befor spreading it back into setVideo post

    // - - or just posting it back to the server
    updateVideo(newLike[0].rating, param);
    getAPI();
    //setVideos([...updatedLikes, newLike[0]]);
  }

  function removeLike(param) {
    const newLike = videos.filter((el) => el.id === param);

    console.log(newLike[0], "befor change");
    newLike[0].rating--;

    updateVideo(newLike[0].rating, param);
    getAPI();
  }

  const addVideo = (title, url) => {
    const newVideo = {
      title,
      url_link: url,
    };

    console.log("newVideo", newVideo);
    const request = new Request(`${API}videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newVideo),
    });
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          setUploadError(true);
          throw new Error("Whoops!");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        const successUpdatedVideo = data.addedData.videoAdded;

        setVideos([...videos, successUpdatedVideo]);
      })
      .catch((error) => {
        console.log("fetch failed", error);
        setUploadError(true);
      });
    //setVideos([...videos, newVideo]);
  };
  const updateVideo = (rating, id) => {
    const updateVid = {
      rating,
      id,
    };

    console.log("newVideo", updateVid);
    const request = new Request(`${API}videos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateVid),
    });
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          //setUploadError(true);
          throw new Error("Whoops!");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        getAPI();
        /* const successUpdatedVideo = data.addedData.videoAdded;

        setVideos([...videos, successUpdatedVideo]); */
      })
      .catch((error) => {
        console.log("fetch failed UPDATE", error);
        //setUploadError(true);
      });
    //setVideos([...videos, newVideo]);
  };
  const deleteVideo = (vidId) => {
    const id = vidId;

    console.log("videoId", id);
    const request = new Request(`${API}videos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          console.log("resoponse not ok");
          //setUploadError(true);
          throw new Error("Whoops!");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        //const successUpdatedVideo = data.addedData.videoAdded;

        getAPI();
      })
      .catch((error) => {
        console.log("fetch failed", error);
        setUploadError(true);
      });
    //setVideos([...videos, newVideo]);
  };
  const getVideo = (vidId) => {
    const id = vidId;

    console.log("videoId", id);
    const request = new Request(`${API}videos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          console.log("resoponse not ok");
          //setUploadError(true);
          throw new Error("Whoops!");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        const successUpdatedVideo = data.videoes;
        setVideos([successUpdatedVideo]);
        //getAPI();
      })
      .catch((error) => {
        console.log("fetch failed get 1", error);
        //setUploadError(true);
      });
    //setVideos([...videos, newVideo]);
  };

  return (
    <VideoAppContainer>
      <Heading>Add your videos</Heading>
      <VideoForm onSubmit={addVideo} />
      {uploadError ? (
        <p>video NOT added please try again</p>
      ) : (
        <p>add title and url then press submit</p>
      )}
      <VideoCardsContainer>
        {loading ? (
          <p>video loading ...</p>
        ) : (
          videos.map((video, index) => (
            <VideoCard
              key={index}
              title={video.title}
              url={video.url_link}
              ratings={video.rating}
              addLike={addLike}
              removeLike={removeLike}
              //likes={likes}
              vid={video.id}
              deleteVid={deleteVideo}
              getVid={getVideo}
            />
          ))
        )}
      </VideoCardsContainer>
      <button onClick={() => getAPI()}>get all</button>
    </VideoAppContainer>
  );
};

export default VideoApp;

const VideoAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;

const Heading = styled.h1`
  margin-bottom: 1rem;
`;

const VideoCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background-color: blue;
`;
