import { useAccount, useConnect, useSignTypedData } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useState } from 'react';

const tokenAddress = '0x31E8b02386D0aFfc7DE567d4421eCF0E24213AB5';
const spender = '0xYourSpenderAddressHere'; // Replace with actual spender
const chainId = 1; // Change if not using Ethereum Mainnet

export default function PermitSigner() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { signTypedDataAsync } = useSignTypedData();
  const [signature, setSignature] = useState(null);

  const domain = {
    name: 'YourTokenName',
    version: '1',
    chainId,
    verifyingContract: tokenAddress,
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const signPermit = async () => {
    if (!isConnected) return alert('Connect your wallet first!');

    const nonce = 0; // Fetch from contract
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const value = BigInt(1 * 10 ** 18); // 1 token (assuming 18 decimals)

    const message = { owner: address, spender, value, nonce, deadline };

    try {
      const signature = await signTypedDataAsync({ domain, types, message });
      setSignature(signature);
      console.log('Signed Permit:', signature);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <div className="p-4">
      {!isConnected ? (
        <button onClick={() => connect()} className="bg-blue-500 text-white p-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <button onClick={signPermit} className="bg-green-500 text-white p-2 rounded">
          Sign Now
        </button>
      )}
      {signature && <p className="mt-2">Signature: {signature}</p>}
    </div>
  );
}
