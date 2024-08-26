import { Authenticator, Button, Flex } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import FaceSearch from "./FaceSearch";
import FaceIndex from "./FaceIndex";

Amplify.configure(outputs);

function App() {
  const faceIndexed = localStorage.getItem("faceIndexed");
  return (
    <Authenticator>
      {({ signOut, user }) => {
        return (
          <main>
            <Flex direction={"row"} gap={"large"}>
              <h1>Hello {user?.username}</h1>
              <Button
                variation="warning"
                onClick={signOut}
                height={32}
                alignSelf={"center"}
              >
                Sign out
              </Button>
            </Flex>
            {faceIndexed === "true" ? <FaceSearch /> : <FaceIndex />}
          </main>
        );
      }}
    </Authenticator>
  );
}

export default App;
