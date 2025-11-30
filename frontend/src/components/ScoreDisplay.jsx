import { motion } from "framer-motion";
import { TrendingUp, Shield, CheckCircle2 } from "lucide-react";

function ScoreDisplay({ scoreData }) {
  const score = scoreData.totalScore || 0;
  const percentage = (score / 1000) * 100;

  const getScoreLevel = (score) => {
    if (score >= 800)
      return {
        label: "Excellent",
        color: "from-green-400 to-emerald-500",
        ring: "ring-green-500/50",
      };
    if (score >= 600)
      return {
        label: "Great",
        color: "from-blue-400 to-cyan-500",
        ring: "ring-blue-500/50",
      };
    if (score >= 400)
      return {
        label: "Good",
        color: "from-yellow-400 to-orange-500",
        ring: "ring-yellow-500/50",
      };
    if (score >= 200)
      return {
        label: "Fair",
        color: "from-orange-400 to-red-500",
        ring: "ring-orange-500/50",
      };
    return {
      label: "Building",
      color: "from-gray-400 to-gray-500",
      ring: "ring-gray-500/50",
    };
  };

  const level = getScoreLevel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Your Reputation Score
          </h3>
          <p className="text-white/60 text-sm">
            Cross-chain trustworthiness rating
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {scoreData.onChain ? (
            <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Stored on Soroban
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/50 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Off-Chain
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-12">
        <div className="relative">
          <div
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${level.color} p-1 ${level.ring} ring-4`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-5xl font-bold text-white"
                >
                  {score}
                </motion.div>
                <div className="text-white/60 text-sm">/ 1000</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <span
              className={`px-4 py-1 rounded-full bg-gradient-to-r ${level.color} text-white text-sm font-semibold`}
            >
              {level.label}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Stellar Score</span>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {scoreData.stellarScore || 0} / <span className="text-white/60">400</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((scoreData.stellarScore || 0) / 400) * 100}%`,
                }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Ethereum Score</span>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {scoreData.ethereumScore || 0} / <span className="text-white/60">400</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((scoreData.ethereumScore || 0) / 400) * 100}%`,
                }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Social Score</span>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {scoreData.socialScore || 0} / <span className="text-white/60">200</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((scoreData.socialScore || 0) / 200) * 100}%`,
                }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreDisplay;
