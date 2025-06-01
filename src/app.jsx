import React, { useState } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, createMint } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { createMetadataAccountV3, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
import { clusterApiUrl } from '@solana/web3.js';

export default function App() {
  const [status, setStatus] = useState('Ready to mint');
  const [mintAddress, setMintAddress] = useState('');
  const [metadataUri, setMetadataUri] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');

  const mintToken = async () => {
    if (!metadataUri || !tokenName || !tokenSymbol) {
      setStatus('Error: fill in name, symbol, and metadata URI');
      return;
    }
    setStatus('Connecting Phantom…');
    try {
      const phantom = new PhantomWalletAdapter();
      await phantom.connect();
      if (!phantom.publicKey) {
        setStatus('Error: Phantom not connected');
        return;
      }

      setStatus('Creating Umi…');
      const umi = createUmi(clusterApiUrl('mainnet-beta')).use(walletAdapterIdentity(phantom));

      setStatus('Creating mint…');
      const mint = generateSigner(umi);
      await createMint(umi, {
        mint,
        decimals: 9,
        authority: umi.identity.publicKey
      }).sendAndConfirm(umi);
      setMintAddress(mint.publicKey.toString());
      setStatus(`Mint created: ${mint.publicKey.toString()}`);

      setStatus('Creating metadata account…');
      const metadataPda = findMetadataPda(umi, { mint: mint.publicKey });
      await createMetadataAccountV3(umi, {
        metadata: metadataPda,
        mint: mint.publicKey,
        mintAuthority: umi.identity,
        updateAuthority: umi.identity,
        data: {
          name: tokenName,
          symbol: tokenSymbol,
          uri: metadataUri,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null
        },
        isMutable: false
      }).sendAndConfirm(umi);
      setStatus('✅ Metadata created and token minted!');
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.message || err.toString()));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Solana Token Launcher</h1>

      <div className="mb-4">
        <label className="block">Token Name:</label>
        <input
          className="w-full p-2 rounded bg-gray-800"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder="e.g. My Cool Token"
        />
      </div>

      <div className="mb-4">
        <label className="block">Token Symbol:</label>
        <input
          className="w-full p-2 rounded bg-gray-800"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          placeholder="e.g. COOL"
        />
      </div>

      <div className="mb-4">
        <label className="block">Metadata URI (IPFS):</label>
        <input
          className="w-full p-2 rounded bg-gray-800"
          value={metadataUri}
          onChange={(e) => setMetadataUri(e.target.value)}
          placeholder="ipfs://bafybe…/metadata.json"
        />
      </div>

      <button
        onClick={mintToken}
        className="w-full p-2 bg-purple-600 rounded hover:bg-purple-700"
      >
        Mint Token on Mainnet
      </button>

      <p className="mt-4 text-yellow-400">{status}</p>
      {mintAddress && (
        <p className="mt-2">
          Mint Address: <code>{mintAddress}</code>{' '}
          <a
            className="underline text-blue-400"
            href={`https://solscan.io/token/${mintAddress}?cluster=mainnet-beta`}
            target="_blank"
            rel="noopener noreferrer"
          >
            (View on Solscan)
          </a>
        </p>
      )}
    </div>
  );
}
