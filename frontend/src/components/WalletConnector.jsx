import { useState, useEffect } from "react";
import { Wallet, ExternalLink, Shield } from "lucide-react";
import { isConnected, setAllowed, getPublicKey } from "@stellar/freighter-api";

function WalletConnector({ onStellarConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [freighterAvailable, setFreighterAvailable] = useState(false);

  useEffect(() => {
    checkFreighterAvailable();
  }, []);

  const checkFreighterAvailable = async () => {
    try {
      await isConnected();
      setFreighterAvailable(true);
    } catch (error) {
      console.log("Freighter API not ready:", error.message);
      setFreighterAvailable(false);
    }
  };

  const connectFreighter = async () => {
    try {
      setIsConnecting(true);

      console.log("🔗 Connecting to Freighter...");

      let publicKey = null;
      const maxRetries = 10;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`\n🔄 Attempt ${attempt}/${maxRetries}...`);

          try {
            await setAllowed();
            console.log("✅ setAllowed() called");
            await new Promise((resolve) => setTimeout(resolve, 1500 + (attempt * 200)));
          } catch (allowError) {
            console.log("⚠️ setAllowed() skipped:", allowError.message);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          publicKey = await getPublicKey();
          console.log(`getPublicKey() result:`, JSON.stringify(publicKey));

          if (publicKey && typeof publicKey === "string" && publicKey.length > 0 && publicKey.startsWith("G")) {
            console.log("✅✅✅ SUCCESS! Valid public key received!");
            break;
          }

          if (!publicKey || publicKey.length === 0) {
            console.log("⚠️ Public key is empty, trying alternative methods...");

            if (window.freighterApi) {
              if (typeof window.freighterApi.getPublicKey === "function") {
                try {
                  const altKey = await window.freighterApi.getPublicKey();
                  if (altKey && typeof altKey === "string" && altKey.startsWith("G")) {
                    publicKey = altKey;
                    console.log("✅ Got public key from window.freighterApi.getPublicKey()!");
                    break;
                  }
                } catch (e) {
                  console.log("window.freighterApi.getPublicKey() failed");
                }
              }

              if (!publicKey && typeof window.freighterApi.getUserInfo === "function") {
                try {
                  const userInfo = await window.freighterApi.getUserInfo();
                  const keyFromInfo = userInfo?.publicKey || userInfo?.key || null;
                  if (keyFromInfo && typeof keyFromInfo === "string" && keyFromInfo.startsWith("G")) {
                    publicKey = keyFromInfo;
                    console.log("✅ Got public key from getUserInfo()!");
                    break;
                  }
                } catch (e) {
                  console.log("getUserInfo() failed");
                }
              }

              if (!publicKey && typeof window.freighterApi.getSelectedAccount === "function") {
                try {
                  const account = await window.freighterApi.getSelectedAccount();
                  const keyFromAccount = account?.publicKey || account?.key || null;
                  if (keyFromAccount && typeof keyFromAccount === "string" && keyFromAccount.startsWith("G")) {
                    publicKey = keyFromAccount;
                    console.log("✅ Got public key from getSelectedAccount()!");
                    break;
                  }
                } catch (e) {
                  console.log("getSelectedAccount() failed");
                }
              }
            }

            if (publicKey && typeof publicKey === "string" && publicKey.length > 0 && publicKey.startsWith("G")) {
              break;
            }
          }

          if (attempt < maxRetries) {
            console.log(`⏳ Waiting before next attempt...`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (attemptError) {
          console.error(`Attempt ${attempt} error:`, attemptError);
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }

      if (publicKey && typeof publicKey === "string" && publicKey.length > 0 && publicKey.startsWith("G")) {
        console.log("✅✅✅ FINAL SUCCESS! Public key:", publicKey.substring(0, 10) + "...");
        setIsConnecting(false);
        onStellarConnect(publicKey);
        return;
      }

      console.error(`❌ Failed after ${maxRetries} attempts. Invalid public key:`, publicKey);
      alert(
        `🔑 Freighter Connection Failed\n\n` +
        `Unable to retrieve public key after ${maxRetries} attempts.\n\n` +
        `Please try:\n` +
        `1. Close and reopen the Freighter popup\n` +
        `2. Make sure you have selected an account in Freighter\n` +
        `3. Refresh the page (F5) and try again`
      );

      setIsConnecting(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(
        `Unexpected error: ${
          error.message || "Unknown error"
        }\n\nPlease open browser console (F12) and check error details.`
      );
    } finally {
      setIsConnecting(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Connect Your Wallets
          </h2>
          <p className="text-white/70">
            Connect your Stellar wallet to get started. You can add Ethereum or
            other blockchains later for cross-chain analysis.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={connectFreighter}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Wallet className="w-5 h-5" />
            <span>{isConnecting ? "Connecting..." : "Connect Freighter"}</span>
            {!isConnecting && <ExternalLink className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-8 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
          <p className="text-sm text-white/80">
            <strong className="text-white">Note:</strong> Connect your Stellar
            wallet to begin. After connecting, you'll be able to choose between
            Stellar-only analysis or cross-chain analysis (including Ethereum,
            Bitcoin, and more).
          </p>
        </div>
      </div>
    </div>
  );
}

export default WalletConnector;
