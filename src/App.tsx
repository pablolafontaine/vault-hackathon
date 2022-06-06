import React, { FC, useMemo} from 'react';
import * as anchor from '@project-serum/anchor';
import { ConnectionProvider, WalletProvider, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { VaultClient, VaultConfig } from '@castlefinance/vault-sdk';
import "./App.css";
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const VaultSetup = async() =>{
	const wallet = (useAnchorWallet()) as Wallet;
	const connection = new Connection("https://api.devnet.solana.com");
	// Pull down the appropriate vault from the API.
const configResponse = await fetch('https://api.castle.finance/configs')
const vaults = (await configResponse.json()) as any[]
const vault = vaults.find(
	(v: any) => v.deploymentEnv == 'devnet' && v.token_label == 'USDC'
)
if(vault == null){
	return;
}


// Create the vault client
const vaultClient = await VaultClient.load(
	new anchor.Provider(connection, wallet, { commitment: "processed",}),
  vault.vault_id,
  vault.deploymentEnv
)
}
export const Vault: FC = () => {
	return(
		<p>Vault</p>
	)
}

	



export const Wallet: FC = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );
	VaultSetup();

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
			<Vault/>
                    { /* Your app's components go here, nested within the context providers. */ }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

function App() {
	
  return (
    <div className="App">
      <header className="App-header">
        <p>
	Welcome to the Vault!
        </p>
	      <Wallet />
      </header>
    </div>
  );
}

export default App;
