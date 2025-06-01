# Solana Token Launcher (Umi + Phantom)

This is a fully working frontend that mints an SPL token on Solana Mainnet using the Umi framework and Phantom wallet.

## How to Deploy & Test

1. **Install Dependencies**  
   Open a terminal in this folder and run:  
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Create a Vercel Project**  
   - Go to https://vercel.com and sign in with your GitHub account.  
   - Click “New Project” and import this repository.  
   - Vercel will auto-detect “Vite” as the framework.  
   - Click “Deploy” (no additional build settings required).

3. **Add Environment Variables (Optional)**  
   If you want a default Helius RPC or NFT.Storage key, set in Vercel’s Settings → Environment Variables.  
   Example:  
   ```
   VITE_DEFAULT_RPC_URL=https://mainnet.helius-rpc.com/?api-key=KEYHERE
   ```

4. **Use the Live URL**  
   Once Vercel deploys, you’ll get a URL like `https://solana-token-launcher-umi.vercel.app`.  
   Open it in your browser.

## How to Mint a Token

1. **Open the Live URL** (or run locally with `npm run dev` and go to `http://localhost:5173`).  
2. **Connect Phantom Wallet** (make sure Phantom is on Mainnet Beta).  
3. **Fill in Token Name**, **Token Symbol**, and **Metadata URI** (an `ipfs://…/metadata.json` you have already uploaded).  
4. **Click “Mint Token on Mainnet”**.  
   - Phantom will pop up to approve.  
   - Two transactions: create the new SPL mint and create the metadata account.  
   - SOL will be deducted for fees.  
5. **After completion**, you’ll see the mint address and a “View on Solscan” link. Click to verify.

## TL;DR

- Copy/paste these files into a folder named `solana-token-launcher-umi`.  
- Push to a new GitHub repo.  
- Import into Vercel and deploy.  
- Your live site is ready—just connect Phantom, fill in the fields, and mint a token.
