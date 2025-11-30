import {
  Clock,
  DollarSign,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function ScoreBreakdown({ scoreData }) {
  const breakdown = scoreData.breakdown || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
          Stellar Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-white/80">Account Age</span>
            </div>
            <span className="text-white font-semibold">
              {breakdown.accountAgeDays || 0} days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-white/80">Transactions</span>
            </div>
            <span className="text-white font-semibold">
              {breakdown.transactionCount || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <span className="text-white/80">Balance</span>
            </div>
            <span className="text-white font-semibold">
              {breakdown.stellarBalance != null
                ? breakdown.stellarBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 5,
                  })
                : "0.00"}{" "}
              XLM
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Ethereum Metrics
        </h3>
        <div className="space-y-4">
          {breakdown.hasEthereumHistory ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">History Verified</span>
                </div>
                <span className="text-green-400 font-semibold">Yes</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Account Age</span>
                </div>
                <span className="text-white font-semibold">
                  {breakdown.ethereumAgeDays || 0} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Transactions</span>
                </div>
                <span className="text-white font-semibold">
                  {breakdown.ethereumTransactionCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Balance</span>
                </div>
                <span className="text-white font-semibold">
                  {breakdown.ethereumBalance?.toFixed(4) || "0.0000"} ETH
                </span>
              </div>
            </>
          ) : scoreData?.ethereumAddress ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80">History Verified</span>
                </div>
                <span className="text-yellow-400 font-semibold">No</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Transactions</span>
                </div>
                <span className="text-white font-semibold">
                  {breakdown.ethereumTransactionCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Balance</span>
                </div>
                <span className="text-white font-semibold">
                  {breakdown.ethereumBalance?.toFixed(4) || "0.0000"} ETH
                </span>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300/80 text-sm">
                  ⚠️ No transaction history found. This wallet may be new or has no activity yet.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No Ethereum address connected</p>
              <p className="text-white/40 text-sm mt-1">
                Connect Ethereum wallet to boost your score
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreBreakdown;
