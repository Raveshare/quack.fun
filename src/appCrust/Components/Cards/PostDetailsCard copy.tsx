import React, { useEffect, useState } from "react";

// @ts-ignore
import BsHeart from "@meronex/icons/bs/BsHeart";
// @ts-ignore
import BsChat from "@meronex/icons/bs/BsChat";
// @ts-ignore
import BsCursor from "@meronex/icons/bs/BsCursor";
// @ts-ignore
import BsHeartFill from "@meronex/icons/bs/BsHeartFill";
// @ts-ignore
import BsCollection from "@meronex/icons/bs/BsCollection";
// @ts-ignore
import SuShuffle from "@meronex/icons/su/SuShuffle";
// // ts-ignore
// import BsBookmark from "@meronex/icons/bs/BsBookmark";

// ts-ignore
import BsArrowRepeat from "@meronex/icons/bs/BsArrowRepeat";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Modal, Spin, message } from "antd";
import { Link } from "react-router-dom";
import {
  apiGetPosts,
  apiReactForAPost,
} from "src/services/BEApis/PostsAPIs/PostsApi.tsx";
import NestedPostCard from "./NestedPostCard.tsx";
import SharePostCard from "./SharePostCard.tsx";
import Iframe from "react-iframe";
import { SandboxAttributeValue } from "react-iframe/types";
import { utilFormatPostText } from "src/appCrust/Components/Utils/functions/utilFormatPostText.tsx";
import { apiGetOgs } from "src/services/BEApis/utils/UtilsApis.tsx";
const PostDetailsCard = ({
  postAuthorFid,
  userPostId, //Hash
  userProfileName,
  userProfileUsername,
  userPostImage,
  userProfileImage,
  userProfilePostText,
  userPostTimestamp,
  postLikes,
  postRecasts,
  frameLink,
  frameTitle,
}: // onClick,
PostCardType) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isRecast, setIsRecast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileTeaser, setProfileTeaser] = useState(false);
  const [reactions, setReactions] = useState({
    likes: postLikes,
    recasts: postRecasts,
  });
  // OG -------------------
  const [ogData, setOgData] = useState({
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    frameImage: "",
    frameButtons: [],
  });

  const [metadata, setMetadata] = useState({
    fcFrame: "",
    frameImage: "",
    ogImage: "",
    frameButton1Label: "",
    frameButton1Action: "post", // Default action is 'post'
    frameButton1Target: "",
    frameButton2Label: "",
    frameButton2Action: "post", // Default action is 'post'
    frameButton2Target: "",
    frameButton3Label: "",
    frameButton3Action: "post", // Default action is 'post'
    frameButton3Target: "",
    frameButton4Label: "",
    frameButton4Action: "post", // Default action is 'post'
    frameButton4Target: "",
    framePostUrl: "",
    frameInputText: "",
    frameImageAspectRatio: "1.91:1", // Default aspect ratio is '1.91:1'
  });

  const handleLikeBtn = () => {
    const likesRes = apiReactForAPost({
      fid: postAuthorFid,
      hash: userPostId,
      reaction: 1,
      type: isLike ? 1 : -1,
    });

    console.log(likesRes);
    setReactions({
      ...reactions,
      likes: postLikes + (isLike ? (postLikes === 0 ? -0 : -1) : +1),
    });
    setIsLike(!isLike);
  };

  const handleCommentBtn = () => {
    setLoading(true);
    setIsCommentsOpen(!isCommentsOpen);

    // userPostId - Fetched from Post Card
    fnLoadNestedPosts(userPostId);
    setLoading(false);
  };

  const handleRecastBtn = () => {
    const recastRes = apiReactForAPost({
      fid: postAuthorFid,
      hash: userPostId,
      reaction: 2,
      type: isLike ? 1 : -1,
    });

    console.log(recastRes);
    setReactions({
      ...reactions,
      recasts: postRecasts + (isRecast ? (postRecasts === 0 ? -0 : -1) : +1),
    });

    !isRecast ? message.success("Recasted") : message.success("Removed Recast");
    setIsRecast(!isRecast);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Function to Load Nested Posts from Post Card based on userId / username and PostId
  const fnLoadNestedPosts = async (userPostId: any) => {
    console.log("userPostId", userPostId);

    const res = await apiGetPosts();
    console.log(res);
    // setComments(res?.data?.posts.slice(0, 5));
  };

  // const fetchOgData = async (url: any) => {
  //   try {
  //     const response = await apiGetOgs(url); // Fetch page content using your API
  //     console.log("OG Response data:", response.data);
  //     if (response?.data) {
  //       // Directly access properties from the response
  //       const {
  //         "og:image": image,
  //         "og:title": title,
  //         "og:description": description,
  //         "fc:frame": fcFrame,
  //         "fc:frame:image": frameImage,
  //       } = response.data;
  //       let buttons = [];

  //       // Assuming you want to handle buttons in the response
  //       for (const key in response.data) {
  //         if (key.startsWith("fc:frame:button:")) {
  //           buttons.push(response.data[key]);
  //         }
  //       }

  //       console.log("OG buttons:", buttons);

  //       setOgData({
  //         ogImage: image || "",
  //         ogTitle: title || "",
  //         ogDescription: description || "",
  //         frameImage: frameImage || "",
  //         frameButtons: buttons,
  //       });

  //       // console.log("OG data:", ogData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching OG data:", error);
  //     // Handle error appropriately
  //   }
  // };

  // useEffect(() => {
  //   if (frameLink) {
  //     fetchOgData(frameLink);
  //   }
  // }, [frameLink]);

  // --------------------
  // useEffect(() => {
  //   const fetchDataAndSetMetadata = async () => {
  //     try {
  //       const response = await apiGetOgs(frameLink);

  //       if (response?.data) {
  //         const {
  //           "og:image": ogImage,
  //           "og:title": ogTitle,
  //           "og:description": ogDescription,

  //           // Frame data
  //           "fc:frame": fcFrame,
  //           "fc:frame:image": frameImage,
  //           "fc:frame:button": frameButton,
  //           "fc:frame:post_url": framePostUrl,
  //           "fc:frame:button:1": frameButton1Label,
  //           "fc:frame:button:1:action": frameButton1Action,
  //           "fc:frame:button:1:target": frameButton1Target,
  //           "fc:frame:input:text": frameInputText,
  //           "fc:frame:image:aspect_ratio": frameImageAspectRatio,
  //           // Button 2
  //           "fc:frame:button:2": frameButton2Label,
  //           "fc:frame:button:2:action": frameButton2Action,
  //           "fc:frame:button:2:target": frameButton2Target,
  //           // Button 3
  //           "fc:frame:button:3": frameButton3Label,
  //           "fc:frame:button:3:action": frameButton3Action,
  //           "fc:frame:button:3:target": frameButton3Target,
  //           // Button 4
  //           "fc:frame:button:4": frameButton4Label,
  //           "fc:frame:button:4:action": frameButton4Action,
  //           "fc:frame:button:4:target": frameButton4Target,
  //         } = response.data;

  //         // Update document head with the fetched metadata
  //         document.title = ogTitle;

  //         // Clear existing meta tags in the head
  //         document.head
  //           .querySelectorAll('meta[name^="og:"]')
  //           .forEach((meta) => {
  //             meta.remove();
  //           });

  //         document.head
  //           .querySelectorAll('meta[name^="fc:frame:"]')
  //           .forEach((meta) => {
  //             meta.remove();
  //           });

  //         // Create and append new meta tags
  //         const metaTags = [
  //           { name: "og:title", content: ogTitle },
  //           { name: "og:description", content: ogDescription },
  //           { name: "og:image", content: ogImage },
  //           { name: "fc:frame", content: fcFrame },
  //           { name: "fc:frame:image", content: frameImage },
  //           { name: "fc:frame:button", content: frameButton },
  //           { name: "fc:frame:post_url", content: framePostUrl },
  //           { name: "fc:frame:button:1", content: frameButton1Label },
  //           { name: "fc:frame:button:1:action", content: frameButton1Action },
  //           { name: "fc:frame:button:1:target", content: frameButton1Target },
  //           { name: "fc:frame:input:text", content: frameInputText },
  //           {
  //             name: "fc:frame:image:aspect_ratio",
  //             content: frameImageAspectRatio,
  //           },
  //           { name: "fc:frame:button:2", content: frameButton2Label },
  //           { name: "fc:frame:button:2:action", content: frameButton2Action },
  //           { name: "fc:frame:button:2:target", content: frameButton2Target },
  //           { name: "fc:frame:button:3", content: frameButton3Label },
  //           { name: "fc:frame:button:3:action", content: frameButton3Action },
  //           { name: "fc:frame:button:3:target", content: frameButton3Target },
  //           { name: "fc:frame:button:4", content: frameButton4Label },
  //           { name: "fc:frame:button:4:action", content: frameButton4Action },
  //           { name: "fc:frame:button:4:target", content: frameButton4Target },
  //         ];

  //         metaTags.forEach((meta) => {
  //           const metaTag = document.createElement("meta");
  //           metaTag.name = meta.name;
  //           metaTag.content = meta.content;
  //           document.head.appendChild(metaTag);
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching OG data:", error);
  //       // Handle error appropriately
  //     }
  //   };

  //   fetchDataAndSetMetadata();
  // }, [frameLink]);

  const handleButtonClick = (idx) => {
    // Implement logic to handle button click based on the idx
    console.log(`Button ${idx} clicked`);
  };

  useEffect(() => {
    const fetchDataAndSetMetadata = async () => {
      try {
        const response = await apiGetOgs(frameLink);

        if (response?.data) {
          setMetadata(response.data);

          //  Update document head with the fetched metadata
          document.title = ogTitle;

          // Clear existing meta tags in the head
          document.head
            .querySelectorAll('meta[name^="og:"]')
            .forEach((meta) => {
              meta.remove();
            });

          document.head
            .querySelectorAll('meta[name^="fc:frame:"]')
            .forEach((meta) => {
              meta.remove();
            });
        }
      } catch (error) {
        console.error("Error fetching OG data:", error);
        // Handle error appropriately
      }
    };

    fetchDataAndSetMetadata();
  }, [frameLink]);

  return (
    <>
      <div className="z-10 overflow-hidden cursor-pointer bg-white  text-slate-800 border-b border-slate-200 hover:bg-slate-50">
        <div className="flex justify-between items-center align-middle mx-4 mt-4 hover:cursor-pointer">
          {/* <header className="flex gap-2 align-middle items-center"> */}
          <div className="flex gap-2 align-middle items-center">
            {/* <Link to={`/profile/${userProfileUsername}`}> */}
            <Link to={`/${postAuthorFid}`}>
              <LazyLoadImage
                src={userProfileImage}
                alt="user name"
                title="user name"
                width="40"
                height="40"
                className="max-w-full rounded-full z-10 h-8 w-8 object-cover"
                effect="blur"
              />
              {/* <img
                src={userProfileImage}
                alt="user name"
                title="user name"
                width="40"
                height="40"
                className="max-w-full rounded-full z-10 h-8 w-8 object-cover"
              />{" "} */}
            </Link>

            <h3 className="text-sm font-medium text-slate-700">
              {userProfileName}
            </h3>
            <Link to={`/${postAuthorFid}`}>
              <p
                onMouseEnter={() => setProfileTeaser(true)}
                // onMouseLeave={() => setProfileTeaser(false)}
                className="text-sm text-slate-400 cursor-pointer hover:underline"
              >
                {" "}
                @{userProfileUsername}
              </p>
            </Link>
          </div>

          {/* <div className="text-sm text-slate-600"> 2 hours ago </div> */}
          <div className="text-sm text-slate-600"> {userPostTimestamp} </div>
          {/* </header> */}
        </div>

        <Link to={`/${postAuthorFid}/${userPostId}`} color="#000">
          <div className="m-4 pb-0">
            {userProfilePostText && (
              <p>{utilFormatPostText(userProfilePostText)}</p>
            )}

            {/* {frameLink && (
              <div className="w-full h-[400px] border rounded-md mt-2">
                <Iframe
                  allow="autoplay"
                  sandbox={
                    "allow-same-origin allow-scripts allow-scripts" as SandboxAttributeValue
                  }
                  url={frameLink}
                  // width={"100%"}
                  // height="320px"
                  className="w-full h-auto md:h-80"
                  frameBorder={0}
                  scrolling="no"
                  loading="lazy"
                  // display="block"
                  // position="relative"
                />
              </div>
            )} */}
          </div>

          {/* -- Profile details -- */}

          <img
            src={metadata.frameImage || metadata.ogImage}
            alt={metadata.fcFrame}
          />
          <h1>{metadata.fcFrame}</h1>

          {/* Render buttons based on presence and sequence */}
          {[1, 2, 3, 4].map(
            (idx) =>
              metadata[`frameButton${idx}Label`] && (
                <button key={idx} onClick={() => handleButtonClick(idx)}>
                  {metadata[`frameButton${idx}Label`]}
                </button>
              )
          )}

          {metadata.frameInputText && (
            <input type="text" placeholder={metadata.frameInputText} />
          )}

          {userPostImage && (
            <div className="mt-2">
              {/* <img
                src={userPostImage}
                alt="card image"
                className="aspect-video w-full p-4"
              /> */}

              <LazyLoadImage
                src={userPostImage}
                alt={userProfileName}
                title={userProfileName}
                // className="max-w-full rounded-full z-10 h-8 w-8 object-cover"
                className="aspect-video w-full p-4"
                effect="blur"
              />
            </div>
          )}

          {ogData?.ogImage && (
            <div className="my-4 mx-4 border rounded-md">
              {/* <img
                src={ogData?.ogImage}
                alt="card image"
                className="aspect-video w-full p-2 rounded-md"
              /> */}
              <LazyLoadImage
                src={ogData?.ogImage}
                alt={userProfileName}
                title={userProfileName}
                // className="max-w-full rounded-full z-10 h-8 w-8 object-cover"
                className="aspect-video w-full p-2 rounded-md"
                effect="blur"
              />
            </div>
          )}
        </Link>

        {/* Icons container */}
        <div className="m-2 flex flex-row justify-between gap-2 cursor-pointer hover:cursor-pointer">
          <div className="flex align-middle justify-between items-center">
            {/* <div className=""> */}
            {!isLike ? (
              <div
                onClick={handleLikeBtn}
                // className="cursor-pointer  m-2 rounded-full hover:bg-red-100 selection: text-red-400 "
                className="cursor-pointer  m-2 rounded-full hover:bg-yellow-100 selection: text-yellow-500 "
              >
                <BsHeart size={20} />
              </div>
            ) : (
              <div
                onClick={handleLikeBtn}
                // className="cursor-pointer  m-2 rounded-full hover:bg-red-100 selection:bg-red-100 text-red-400"
                className="cursor-pointer  m-2 rounded-full hover:bg-yellow-100 selection:bg-yellow-100 text-yellow-500"
              >
                <BsHeartFill size={20} />
              </div>
            )}
            <div className="cursor-pointer ml-0.5 text-sm">
              {reactions.likes}{" "}
            </div>
            {/* </div> */}

            {/* <div
              onClick={handleCommentBtn}
              className=" cursor-pointer m-2 p-2  rounded-full  hover:bg-yellow-50 selection: text-yellow-500"
            >
              <BsChat size={20} />
            </div> */}

            {/* <div className=" cursor-pointer m-2 p-2  rounded-full  hover:bg-yellow-50 selection: text-yellow-500">
              <BsCollection size={20} />
            </div> */}

            {/* <div className="cursor-pointer mt-2.5 m-2 p-2 rounded-full hover:bg-yellow-50 selection:text-yellow-500"> */}
            <div
              onClick={handleRecastBtn}
              className="cursor-pointer m-2 ml-4 rounded-full hover:bg-yellow-100 selection: text-yellow-500"
            >
              <BsArrowRepeat
                // style={{ color: "#CC9999" }}
                size={24}
                // className="text-yellow-500!important "
              />
            </div>
            <div className="cursor-pointer ml-0.5 text-sm">
              {reactions.recasts}{" "}
            </div>
          </div>
          <div className="flex">
            {/* <div className="cursor-pointer m-2 p-2 rounded-full hover:bg-yellow-50 selection: text-yellow-500">
              <BsBookmark
                size={20}
                onClick={() => message.success("Added to bookmarks")}
              />
            </div> */}

            <div className="cursor-pointer m-2 rounded-full hover:bg-yellow-100 selection: text-yellow-500">
              <BsCursor size={20} onClick={showModal} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        okText="Share"
        title="Share this Post"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <SharePostCard
          userPostId={userPostId}
          userProfilePostText={userProfilePostText}
          userPostImage={userPostImage}
          postAuthorFid={postAuthorFid}
          frameLink={ogData?.ogImage}
        />
      </Modal>
      {loading && <Spin />}
      {isCommentsOpen ? (
        <>
          {" "}
          {comments?.length > 0 && (
            <div className="">
              {comments?.map((comment: any) => (
                // <CommentsCard
                //   commentUserImage={`https://picsum.photos/id/${comment?.id}/40/40`}
                //   commentAction={"Replied"}
                //   commentUser={comment?.user?.username}
                //   commentTimeStamp={"2 hours ago"}
                //   commentText={comment?.body}
                //   commentUsername={comment?.userProfileUsername}
                // />

                <NestedPostCard
                  key={comment.id}
                  userPostId={comment.id}
                  postLikes={comment.reactions}
                  userProfileImage={`https://picsum.photos/id/${
                    comment.id + 300
                  }/40/40`}
                  userProfileName={"Scripts"}
                  userProfileUsername={`userid${comment.userId}`}
                  userPostImage={`https://picsum.photos/id/${
                    comment.id + 300
                  }/800/600`}
                  userProfilePostText={comment.body}
                />
              ))}
            </div>
          )}
          {/* <Button onClick={handleCommentBtn()}>View all comments</Button> */}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default PostDetailsCard;
