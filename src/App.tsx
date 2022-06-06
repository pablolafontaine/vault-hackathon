import React, { FC, useMemo, useState} from 'react';
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


export const Vault: FC = () => {
	const wallet = useAnchorWallet();
	const [bal, setBal] = useState(0);
	const [convertedBal, setConvertedBal] = useState(0);
	const VaultSetup = (wallet: any) => {
		const connection = new Connection("https://api.devnet.solana.com");
		return connection.getBalance(wallet.publicKey).then(
		function(value) {
			return new Promise(function(resolve){
				setBal(value/1000000000);
				setConvertedBal(+((value/1000000000* 42.55).toFixed(2)));
			});
		}
	);
	
}
	return(
		<>	
			<button onClick={() => {VaultSetup(wallet);}}>
				Fetch balance
			</ button >
				<p>
					You have: {bal} SOL or
					${convertedBal} USD
				</p>
		</>
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

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
			<Vault />
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
