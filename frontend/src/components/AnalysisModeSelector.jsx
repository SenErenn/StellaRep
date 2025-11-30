import { useState } from "react";
import { TrendingUp, Zap, Network } from "lucide-react";

function AnalysisModeSelector({ stellarAddress, onModeSelected }) {

  const handleStellarOnly = () => {
    onModeSelected({
      mode: "stellar-only",
      chains: ["stellar"],
      addresses: { stellar: stellarAddress },
    });
  };

  const handleCrossChain = () => {
    onModeSelected({
      mode: "cross-chain",
      chains: ["stellar"],
      addresses: { stellar: stellarAddress },
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Calculate Your Trust Score?
          </h2>
          <p className="text-white/70 text-lg">
            Choose how you want to analyze your reputation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleStellarOnly}
            className="bg-white/5 hover:bg-white/10 border-2 border-purple-500/50 hover:border-purple-500 rounded-xl p-6 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Stellar Only
            </h3>
            <p className="text-white/60 text-sm">
              Analyze your reputation based solely on your Stellar wallet
              activity
            </p>
          </button>

          <button
            onClick={handleCrossChain}
            className="bg-white/5 hover:bg-white/10 border-2 border-blue-500/50 hover:border-blue-500 rounded-xl p-6 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Cross-Chain Analysis
            </h3>
            <p className="text-white/60 text-sm">
              Combine multiple blockchains for a comprehensive reputation score
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisModeSelector;
