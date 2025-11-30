import { TrendingUp, Code2 } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">StellaRep</h1>
              <p className="text-sm text-white/70">Cross-Chain Reputation Protocol</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1.5 rounded-lg">
              <Code2 className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-300">Soroban</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 font-medium">Stellar Network</p>
              <p className="text-xs text-white/60">Testnet</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
