import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import WalletConnector from "./components/WalletConnector";
import AnalysisModeSelector from "./components/AnalysisModeSelector";
import CrossChainSelector from "./components/CrossChainSelector";

function App() {
  const [stellarAddress, setStellarAddress] = useState(null);
  const [analysisMode, setAnalysisMode] = useState(null);
  const [chainData, setChainData] = useState(null);

  const handleModeSelected = (data) => {
    if (data.mode === "cross-chain") {
      setAnalysisMode("selecting-chains");
    } else {
      setChainData(data);
      setAnalysisMode("ready");
    }
  };

  const handleChainsSelected = (data) => {
    setChainData(data);
    setAnalysisMode("ready");
  };

  const handleBackToModeSelection = () => {
    setAnalysisMode(null);
  };

  const handleDisconnect = () => {
    setStellarAddress(null);
    setAnalysisMode(null);
    setChainData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {!stellarAddress ? (
          <WalletConnector onStellarConnect={setStellarAddress} />
        ) : analysisMode === null ? (
          <AnalysisModeSelector
            stellarAddress={stellarAddress}
            onModeSelected={handleModeSelected}
          />
        ) : analysisMode === "selecting-chains" ? (
          <CrossChainSelector
            stellarAddress={stellarAddress}
            onChainsSelected={handleChainsSelected}
            onBack={handleBackToModeSelection}
          />
        ) : (
          <Dashboard
            stellarAddress={stellarAddress}
            ethereumAddress={chainData?.addresses?.ethereum || null}
            chainData={chainData}
            onDisconnect={handleDisconnect}
          />
        )}
      </div>
    </div>
  );
}

export default App;
