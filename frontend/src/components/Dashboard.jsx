import { useState, useEffect } from 'react'
import { TrendingUp, Clock, DollarSign, Activity, LogOut, CheckCircle2, XCircle } from 'lucide-react'
import { calculateReputation, getReputation } from '../services/api'
import ScoreDisplay from './ScoreDisplay'
import ScoreBreakdown from './ScoreBreakdown'
import LoadingSpinner from './LoadingSpinner'
import SorobanInfo from './SorobanInfo'

function Dashboard({ stellarAddress, ethereumAddress, chainData, onDisconnect }) {
  const [scoreData, setScoreData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (stellarAddress && !chainData) {
      loadReputation()
    }
  }, [stellarAddress])

  const loadReputation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getReputation(stellarAddress)
      setScoreData(data)
    } catch (err) {
      console.error('Error loading reputation:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCalculate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const ethAddress = chainData?.addresses?.ethereum || ethereumAddress || null
      const data = await calculateReputation(stellarAddress, ethAddress)
      setScoreData(data)
    } catch (err) {
      setError(err.message || 'Failed to calculate reputation')
      console.error('Error calculating reputation:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedChainsText = () => {
    if (!chainData) return 'Stellar'
    const chains = chainData.chains || ['stellar']
    return chains.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' + ')
  }

  const getScoreLevel = (score) => {
    if (score >= 800) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' }
    if (score >= 600) return { label: 'Great', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    if (score >= 400) return { label: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    if (score >= 200) return { label: 'Fair', color: 'text-orange-400', bg: 'bg-orange-500/20' }
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Reputation Dashboard</h2>
          <p className="text-white/60 text-sm">
            {getSelectedChainsText()}: {stellarAddress?.substring(0, 8)}...{stellarAddress?.substring(48)}
            {chainData?.addresses?.ethereum && ` • Ethereum: ${chainData.addresses.ethereum.substring(0, 6)}...${chainData.addresses.ethereum.substring(38)}`}
          </p>
        </div>
        <button
          onClick={onDisconnect}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>

      <SorobanInfo scoreData={scoreData} stellarAddress={stellarAddress} />

      {!scoreData ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Calculate Your Reputation Score
            </h3>
            <p className="text-white/70 mb-6">
              {chainData?.mode === 'stellar-only' 
                ? 'Get your reputation score based on your Stellar wallet activity'
                : `Get your cross-chain reputation score based on your ${getSelectedChainsText()} wallet activity`}
            </p>
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Calculating...' : 'Calculate Reputation'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <ScoreDisplay scoreData={scoreData} />
          <ScoreBreakdown scoreData={scoreData} />
        </>
      )}

      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export default Dashboard
