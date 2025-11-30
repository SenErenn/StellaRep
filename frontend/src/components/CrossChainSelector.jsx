import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";

const AVAILABLE_CHAINS = [
  { id: "ethereum", name: "Ethereum", icon: "⟠", color: "from-blue-400 to-cyan-500" },
  { id: "bitcoin", name: "Bitcoin", icon: "₿", color: "from-orange-400 to-yellow-500" },
  { id: "polygon", name: "Polygon", icon: "⬟", color: "from-purple-400 to-pink-500" },
  { id: "binance", name: "BNB Chain", icon: "🔷", color: "from-yellow-400 to-orange-500" },
];

function CrossChainSelector({ stellarAddress, onChainsSelected, onBack }) {
  const [selectedChains, setSelectedChains] = useState([]);
  const [addresses, setAddresses] = useState({});

  const toggleChain = (chainId) => {
    if (selectedChains.includes(chainId)) {
      setSelectedChains(selectedChains.filter((id) => id !== chainId));
      const newAddresses = { ...addresses };
      delete newAddresses[chainId];
      setAddresses(newAddresses);
    } else {
      setSelectedChains([...selectedChains, chainId]);
      setAddresses({ ...addresses, [chainId]: "" });
    }
  };

  const handleAddressChange = (chainId, value) => {
    setAddresses({ ...addresses, [chainId]: value });
  };

  const handleContinue = () => {
    const allAddressesFilled = selectedChains.every(
      (chainId) => addresses[chainId] && addresses[chainId].trim().length > 0
    );

    if (!allAddressesFilled) {
      alert("Please enter wallet addresses for all selected blockchains");
      return;
    }

    onChainsSelected({
      mode: "cross-chain",
      chains: ["stellar", ...selectedChains],
      addresses: { stellar: stellarAddress, ...addresses },
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Select Blockchains
            </h2>
            <p className="text-white/60">
              Choose which blockchains to include in your analysis
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-300 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Stellar Wallet Connected</span>
          </div>
          <p className="text-blue-200/80 text-sm">
            {stellarAddress?.substring(0, 8)}...{stellarAddress?.substring(48)}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {AVAILABLE_CHAINS.map((chain) => {
            const isSelected = selectedChains.includes(chain.id);
            return (
              <div
                key={chain.id}
                className={`bg-white/5 border-2 rounded-xl p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleChain(chain.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-500 border-blue-500"
                          : "border-white/30"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <span className="text-2xl">{chain.icon}</span>
                    <span className="text-white font-semibold text-lg">
                      {chain.name}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <label className="block text-white/70 text-sm mb-2">
                      {chain.name} Wallet Address
                    </label>
                    <input
                      type="text"
                      value={addresses[chain.id] || ""}
                      onChange={(e) =>
                        handleAddressChange(chain.id, e.target.value)
                      }
                      placeholder={`Enter your ${chain.name} wallet address`}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm">
            {selectedChains.length} blockchain(s) selected
          </p>
          <button
            onClick={handleContinue}
            disabled={selectedChains.length === 0}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrossChainSelector;
