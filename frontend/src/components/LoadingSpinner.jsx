import { Loader2 } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white text-center font-medium">Calculating reputation score...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
