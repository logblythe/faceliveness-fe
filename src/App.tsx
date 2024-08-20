import * as React from "react";
import { Authenticator, Loader } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";

Amplify.configure(outputs);

function App() {
  const [loading, setLoading] = React.useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {
      const response = await fetch(
        "https://faceliveness-be-production.up.railway.app/faceLiveness/createSession"
      );
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
      `https://faceliveness-be-production.up.railway.app/faceLiveness/getSessionResult/${createLivenessApiData.sessionId}`
    );
    const data = await response.json();
    console.log("🚀 ~ handleAnalysisComplete ~ data:", data);

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
    if (data.isLive) {
      console.log("User is live");
    } else {
      console.log("User is not live");
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          {loading ? (
            <Loader />
          ) : createLivenessApiData === null ? (
            "start"
          ) : (
            <FaceLivenessDetector
              sessionId={createLivenessApiData.sessionId}
              region="us-east-1"
              onAnalysisComplete={handleAnalysisComplete}
              onError={(error) => {
                console.error(error);
              }}
            />
          )}
        </main>
      )}
    </Authenticator>
  );
}

export default App;
