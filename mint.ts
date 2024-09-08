import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import secret from './guideSecret.json';


const umi = createUmi('https://solana-devnet.g.alchemy.com/v2/TlX0XchRDWs9M4fpZeXYct9zFc79xcOa');
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
    name: "PokeMon",
    symbol: "PMON",
    uri: "https://ipfs.io/ipfs/QmTMiyXFqaeTdc9WHXn79g3svGCAgWHmhNY4D7ouPw3w8A?filename=pokemon.png"
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 1000000_00000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi)
    .then(() => {
        console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
    })
    .catch((err) => {
        console.error("Error minting tokens:", err);
    });