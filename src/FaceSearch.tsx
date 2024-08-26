import * as React from "react";
import { Flex, Heading, Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { ISessionResult, S3Object2 } from "./types/ISessionResult";
import { IFaceMatch } from "./types/IFaceMatches";
import { BASE_URL } from "./consts";

function FaceSearch() {
  const [loading, setLoading] = React.useState(true);
  const [isSearchingFace, setIsSearchingFace] = React.useState(false);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {
      const response = await fetch(`${BASE_URL}/faceLiveness/createSession`);
      const data = await response.json();
      setCreateLivenessApiData({ sessionId: data.SessionId });
      setLoading(false);
    };
    fetchCreateLiveness();
  }, []);

  const searchFace = async ({ Bucket, Name, Version }: S3Object2) => {
    setIsSearchingFace(true);
    const response = await fetch(`${BASE_URL}/faceLiveness/searchFace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucket: Bucket,
        name: Name,
        version: Version,
      }),
    });
    const res: IFaceMatch = await response.json();
    setIsSearchingFace(false);
    if (response.ok && res.faceMatches.length > 0) {
      const name = res.faceMatches[0].Face.ExternalImageId;
      alert(`You are ${name}`);
    } else {
      alert("No search result");
    }
  };

  const handleAnalysisComplete = async () => {
    if (createLivenessApiData === null) {
      return;
    }
    const response = await fetch(
      `${BASE_URL}/faceLiveness/getSessionResult/${createLivenessApiData.sessionId}`
    );
    const data: ISessionResult = await response.json();
    console.log("🚀 ~ handleAnalysisComplete ~ data:", data);
    if (data.Confidence > 95) {
      searchFace(data.ReferenceImage.S3Object);
    } else {
      alert("You are not live. Please try again");
    }
  };

  return (
    <>
      {isSearchingFace ? (
        <Flex direction={"column"}>
          <Loader size="small" variation="linear" />
          <Heading width="30vw" level={5}>
            Indexing your face
          </Heading>
        </Flex>
      ) : null}
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "60%",
          }}
        >
          <FaceLivenessDetector
            sessionId={createLivenessApiData?.sessionId ?? ""}
            region="us-east-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={(error) => {
              console.error(error);
            }}
          />
        </div>
      )}
    </>
  );
}

export default FaceSearch;
