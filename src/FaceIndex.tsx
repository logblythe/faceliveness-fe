import * as React from "react";
import {
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Label,
  Loader,
} from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { ISessionResult, S3Object2 } from "./types/ISessionResult";
import { BASE_URL } from "./consts";

type FACE_CHECK_STATE = "NAME_INPUT" | "FACE_CHECKING" | "FACE_INDEXING";

function FaceIndex() {
  const [faceCheckState, setFaceCheckState] =
    React.useState<FACE_CHECK_STATE>("NAME_INPUT");
  const [loading, setLoading] = React.useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {
      const response = await fetch(`${BASE_URL}/faceLiveness/createSession`);
      const data = await response.json();
      setCreateLivenessApiData({ sessionId: data.SessionId });
      setLoading(false);
    };
    fetchCreateLiveness();
  }, []);

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
      alert("You are live. Please hold on while we index your face");
      indexFace(data.ReferenceImage.S3Object, name);
    } else {
      alert("You are not live. Please try again");
      setFaceCheckState("NAME_INPUT");
    }
  };

  const indexFace = async (
    { Bucket, Name, Version }: S3Object2,
    username: string
  ) => {
    console.log({ Bucket, Name, Version });
    setFaceCheckState("FACE_INDEXING");
    const response = await fetch(`${BASE_URL}/faceLiveness/indexFace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucket: Bucket,
        name: Name,
        version: Version,
        username: username,
      }),
    });
    console.log("🚀 ~ indexFace ~ response:", response);
    if (response.ok) {
      alert("Your face has been indexed.");
      localStorage.setItem("faceIndexed", "true");
    } else {
      alert("Your face couldn't be indexed. Please try again");
    }
    setFaceCheckState("NAME_INPUT");
  };

  return (
    <>
      {faceCheckState === "NAME_INPUT" ? (
        <>
          <Flex direction={"column"} gap={"small"}>
            <Heading width="30vw" level={5}>
              Enter your name to get started.
            </Heading>
            <Divider orientation="horizontal" />
          </Flex>
          <Flex
            as="form"
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            alignContent="flex-start"
            wrap="nowrap"
            gap="1rem"
            onSubmit={(e) => {
              e.preventDefault();
              setFaceCheckState("FACE_CHECKING");
            }}
          >
            <Flex direction="column" gap="small">
              <Label htmlFor="name">Name:</Label>
              <Input
                id="name"
                name="name"
                isRequired={false}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Flex>
            <Button variation="primary" type="submit">
              Submit
            </Button>
          </Flex>
        </>
      ) : null}
      {faceCheckState === "FACE_CHECKING" ? (
        loading ? (
          <Loader />
        ) : createLivenessApiData === null ? (
          "start"
        ) : (
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "60%",
            }}
          >
            <FaceLivenessDetector
              sessionId={createLivenessApiData.sessionId}
              region="us-east-1"
              onAnalysisComplete={handleAnalysisComplete}
              onError={(error) => {
                console.error(error);
              }}
            />
          </div>
        )
      ) : null}
      {faceCheckState === "FACE_INDEXING" ? (
        <Flex direction={"column"}>
          <Loader size="small" variation="linear" />
          <Heading width="30vw" level={5}>
            Indexing your face
          </Heading>
        </Flex>
      ) : null}
    </>
  );
}

export default FaceIndex;
