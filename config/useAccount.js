import { useEffect, useState } from "react";
import { isConnected, getUserInfo } from "@stellar/freighter-api";

let address;

const addressLookup = async () => {
  if (await isConnected()) return getUserInfo();
  return null;
};

const addressObject = {
  address: "",
  displayName: "",
};

const addressToHistoricObject = (address) => {
  addressObject.address = address;
  addressObject.displayName = `${address.slice(0, 4)}...${address.slice(-4)}`;
  return addressObject;
};

export function useAccount() {
  const [, setLoading] = useState(address === undefined);

  useEffect(() => {
    if (address !== undefined) return;

    addressLookup()
      .then((user) => {
        if (user) address = user.publicKey;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (address) return addressToHistoricObject(address);

  return null;
}
