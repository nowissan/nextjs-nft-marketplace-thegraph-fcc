import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constatns/BasicNft.json"
import Image from "next/image"
import { Card } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal.js"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const separatorLength = separtor.length
    const charsToShow = strLen - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => {
        setShowModal(false)
    }

    const { runContractFunctions: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const handleCardClick = () => {
        isOwnedByUser ? setShowModal(true) : console.log("Let's buy!")
    }

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(tokenURI)
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ifps/io/ipfs/"
            )
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURLResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            setImageURI(imageURIURL)
            setTokenName(tokenURLResponse.name)
            setTokenDescription(tokenURLResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser
        ? "you"
        : truncateStr(seller || "", 15)

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={false}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div calssName="italic text-sm">
                                    Owned by {seller}
                                </div>
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    height="200"
                                    width="200"
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")}{" "}
                                    ETH
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
