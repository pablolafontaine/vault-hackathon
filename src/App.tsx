import React, { FC, useMemo, useState} from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
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
	const [oneYearAmount, setOneYearAmount] = useState(0);
	const [tenYearAmount, setTenYearAmount] = useState(0);
	const [oneYearAmountConverted, setOneYearAmountConverted] = useState(0);
	const [tenYearAmountConverted, setTenYearAmountConverted] = useState(0);

	const VaultSetup = async (wallet: any) => {
		const connection = new Connection("https://api.devnet.solana.com");
		return connection.getBalance(wallet.publicKey).then(
		function(value) {
			return new Promise(function(resolve){
				setBal(value/1000000000);
				setConvertedBal(+((value/1000000000* 42.55).toFixed(2)));
				setOneYearAmount(+(value/1000000000*1.0193).toFixed(5));
				setOneYearAmountConverted(+((value/1000000000*1.0193* 42.55).toFixed(2)));
				setTenYearAmount(+((value/1000000000)*Math.pow(1.0193, 10)).toFixed(5));
				setTenYearAmountConverted(+(((value/1000000000*42.55)*Math.pow(1.0193, 10)).toFixed(2)));

			});
		}
	);
	
}

	return(
		<>	
			<button className="fetch-balance"  onClick={() => {VaultSetup(wallet);}}>
				Calculate!	
			</ button >
				<h3>
					You have:
				</h3>
			<p>
					{bal} SOL or
					${convertedBal} USD
				</p>
				<p>
				<br />
				</p>
				
				<h3>
					You could have:
				</h3>
			<p style={{marginTop: "0.2em", marginBottom: "0.2em"}}>
					{oneYearAmount} SOL or
				${oneYearAmountConverted} USD <br />
				if you used <b> Castle Finance</b> for a year
				<h3> or: </h3>
				</p>
					{tenYearAmount} SOL or
				${tenYearAmountConverted} USD <br />
				if you used it for 10 years!
			<a href="https://castle.finance/" className="App-link">
					Learn more
					</a>
				<p>
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
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

function App() {
	
  return (
    <div className="App">
      <header className="App-header">
        <h4>
		Welcome to the <b>Vault</b>!
        </h4>
	      <Wallet />
      </header>
    </div>
  );
}

export default App;
