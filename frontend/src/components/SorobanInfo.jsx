import { motion } from "framer-motion";
import { Code2, CheckCircle2, ExternalLink, Shield, Sparkles } from "lucide-react";

function SorobanInfo({ scoreData, stellarAddress }) {
  const isOnChain = scoreData?.onChain || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border-2 border-purple-400/30 mb-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Soroban Smart Contract</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h3>
            <p className="text-white/70 text-sm mt-1">
              Powered by Stellar's Native Smart Contract Platform
            </p>
          </div>
        </div>
        {isOnChain ? (
          <div className="flex items-center space-x-2 bg-green-500/30 border-2 border-green-400/50 px-4 py-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-300" />
            <span className="text-sm font-semibold text-green-300">Active</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-purple-500/30 border-2 border-purple-400/50 px-4 py-2 rounded-lg">
            <Shield className="w-5 h-5 text-purple-300" />
            <span className="text-sm font-semibold text-purple-300">Off-Chain</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>On-Chain Storage</span>
          </h4>
          <p className="text-white/70 text-sm">
            Your reputation score is {isOnChain ? "securely stored" : "ready to be stored"} on Stellar's Soroban blockchain, making it transparent, verifiable, and tamper-proof.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
            <Code2 className="w-4 h-4" />
            <span>Smart Contract</span>
          </h4>
          <p className="text-white/70 text-sm">
            Built with Rust on Soroban, our contract stores reputation data on-chain, enabling trustless verification across the Stellar ecosystem.
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Why Soroban Matters</span>
        </h4>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300 mb-1">3-5s</div>
            <div className="text-white/70 text-xs">Finality</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-300 mb-1">&lt;$0.01</div>
            <div className="text-white/70 text-xs">Per Transaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300 mb-1">Energy</div>
            <div className="text-white/70 text-xs">Efficient</div>
          </div>
        </div>
        <p className="text-white/80 text-sm mt-3">
          StellaRep leverages Soroban's fast, low-cost, and sustainable infrastructure to create the first cross-chain reputation protocol on Stellar. Your reputation is calculated from multiple blockchains and stored immutably on Soroban.
        </p>
      </div>

      {isOnChain && stellarAddress && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/70 text-sm">
            <strong className="text-white">Contract Status:</strong> Your reputation score is live on Soroban Testnet. This enables DeFi protocols, Anchors, and other Stellar applications to verify your trustworthiness on-chain.
          </p>
        </div>
      )}

      {!isOnChain && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/70 text-sm">
            <strong className="text-white">Note:</strong> The smart contract is deployed and ready. Your reputation will be stored on-chain once you calculate your score.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default SorobanInfo;
