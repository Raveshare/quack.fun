// Documentation for Solana wallet providers:
// https://github.com/solana-labs/wallet-adapter
/*
 * Npm package `@solana/wallet-adapter-wallets`.
 */

import React, { useEffect, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import SidebarItem from "./SidebarItem";

import { Button, Popover, Tooltip, message } from "antd";
import MdPower from "@meronex/icons/ios/MdPower";
import { Link } from "react-router-dom";
// @ts-ignore
import MdMore from "@meronex/icons/ios/MdMore";
// @ts-ignore
import CgArrowsExchangeV from "@meronex/icons/cg/CgArrowsExchangeV";
// ts-ignore
import MdContentCopy from "@meronex/icons/md/MdContentCopy";
import { utilCopyToClip } from "../Utils/functions/utilCopyToClip";
import { UtilLoginToApp } from "../Utils/components/utilLoginToApp";
import useUser from "src/hooks/userHooks/useUser";

export const SolLoginBtn: FC = () => {
  return (
    <SolLoginBtnContext>
      <SolLoginBtnUI />
    </SolLoginBtnContext>
  );
};

const SolLoginBtnContext: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new UnsafeBurnerWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const SolLoginBtnUI: FC = () => {
  const { connected, disconnect, publicKey: address } = useWallet();
  const { userData, fid } = useUser();
  const [hasLoggedInBtnContext, setHasUserLoggedInBtnContext] = useState(false);

  console.log(connected);
  console.log(address);

  const handleDisconnect = () => {
    message.success("Disconnected");
    disconnect();
    setHasUserLoggedInBtnContext(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("fid");
  };

  const fnCheckLocalStorage = () => {
    if (
      localStorage.getItem("jwt") !== null &&
      localStorage.getItem("fid") !== null
    ) {
      setHasUserLoggedInBtnContext(true);
    } else {
      setHasUserLoggedInBtnContext(false);
    }
  };

  useEffect(() => {
    fnCheckLocalStorage();
  }, []);

  useEffect(() => {
    fnCheckLocalStorage();
  }, [connected]);
  return (
    <>
      {!connected && (
        <>
          <WalletMultiButton>
            <div className="hidden md:flex justify-center">Select Wallet</div>
            <div className="md:hidden m-2 w-20"> Connect</div>
          </WalletMultiButton>
        </>
      )}
      {connected && (
        <>
          <div className="flex justify-between items-center align-middle ">
            <Link to={`/${fid}`}>
              <SidebarItem
                className="hidden md:inline-block"
                itemName={
                  `${(userData as { username?: string })?.username}` ||
                  "quackuser"
                }
                userPicture={"https://i.pravatar.cc/24?img=3"}
              />

              {/* Hide Username for Mobile */}
              <img
                src="https://i.pravatar.cc/24?img=3"
                className="inline-block md:hidden rounded-full mx-4 w-8 h-8"
                alt=""
              />
            </Link>

            {/* More Options Button */}
            <div className="">
              <Popover
                placement="bottom"
                content={
                  <div className="flex flex-col">
                    {/* <Button
                      onClick={() => select}
                      className="mr-2 mb-2"
                      icon={<CgArrowsExchangeV size={16}/>}
                    >
                      Change Wallet
                    </Button> */}
                    <Button
                      onClick={() =>
                        utilCopyToClip(address ? address.toString() : "")
                      }
                      className="mr-2"
                      icon={<MdContentCopy />}
                    >
                      {address?.toString().slice(0, 6) +
                        "..." +
                        address?.toString().slice(-4)}
                    </Button>

                    <Tooltip title="Disconnect">
                      <Button
                        className="md:hidden mr-2 mt-2"
                        onClick={handleDisconnect}
                        icon={<MdPower />}
                      >
                        Disconnect
                      </Button>
                    </Tooltip>
                  </div>
                }
              >
                {" "}
                {/* <Tooltip  open={ true} title="Wallet Options"> */}
                <Button
                  className="mr-2"
                  // onClick={() => select}
                  icon={<MdMore />}
                ></Button>
                {/* </Tooltip> */}
              </Popover>

              <Tooltip title="Disconnect">
                <Button
                  className="hidden md:inline-block mr-2"
                  onClick={handleDisconnect}
                  icon={<MdPower />}
                ></Button>
              </Tooltip>
            </div>
          </div>
        </>
      )}
      {/* {!connected && !hasUserLoggedIn && <UtilLoginToApp />} */}
      {!hasLoggedInBtnContext && <UtilLoginToApp />}
    </>
  );
};
