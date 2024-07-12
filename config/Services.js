import {
  Keypair,
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";

import { userSignTransaction } from "./Freighter";

let rpcUrl = "https://soroban-testnet.stellar.org";

let contractAddress =
  "CCZR36EXIXKBNV5WBD23B7LNXE62VUEMKVRGNGVTTN5VBSE73YNDU25T";

const sourceKeypair = Keypair.fromSecret(
  "SDCSIPSBQ2RWO4B6EVGRBKFJSDSAKCHDOBGDW6RK5GJPLIOCPGB36XZ2"
);

export const accountToScVal = (account) => new Address(account).toScVal();

export const stringToScValString = (value) => {
  return nativeToScVal(value);
};

const numberToU64 = (value) => {
  return nativeToScVal(value, { type: "u64" });
};

const vecToScValVec = (env, vec) => {
  return nativeToScVal(vec, { type: "vec" });
};

let params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
};

async function contractInt(caller, functName, values) {
  const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
  const sourceAccount = await provider.getAccount(caller);
  const contract = new Contract(contractAddress);
  let buildTx;

  if (values == null) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName))
      .setTimeout(30)
      .build();
  } else if (Array.isArray(values)) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, ...values))
      .setTimeout(30)
      .build();
  } else {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, values))
      .setTimeout(30)
      .build();
  }

  let _buildTx = await provider.prepareTransaction(buildTx);

  let prepareTx = _buildTx.toXDR();

  let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);

  let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);

  try {
    let sendTx = await provider.sendTransaction(tx).catch(function (err) {
      console.error("Catch-1", err);
      return err;
    });
    if (sendTx.errorResult) {
      throw new Error("Unable to submit transaction");
    }
    if (sendTx.status === "PENDING") {
      let txResponse = await provider.getTransaction(sendTx.hash);
      while (txResponse.status === "NOT_FOUND") {
        txResponse = await provider.getTransaction(sendTx.hash);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (txResponse.status === "SUCCESS") {
        let result = txResponse.returnValue;
        return result;
      }
    }
  } catch (err) {
    console.log("Catch-2", err);
    return;
  }
}

async function registerUser(caller, username, wallet) {
  let usernameScVal = stringToScValString(username);
  let walletScVal = accountToScVal(wallet);
  let values = [usernameScVal, walletScVal];

  try {
    await contractInt(caller, "register_user", values);
    console.log(
      `User ${username} with wallet ${wallet} registered successfully`
    );
  } catch (error) {
    console.log("User registration failed", error);
  }
}

const isUserRegistered = async (wallet) => {
  try {
    const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443"
    );
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
    const contract = new Contract(contractAddress);

    let builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("is_user_registered", accountToScVal(wallet)))
      .setTimeout(30)
      .build();

    let preparedTransaction = await server.prepareTransaction(builtTransaction);
    preparedTransaction.sign(sourceKeypair);

    let sendResponse = await server.sendTransaction(preparedTransaction);
    console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);

    if (sendResponse.status === "PENDING") {
      let getResponse = await server.getTransaction(sendResponse.hash);
      while (getResponse.status === "NOT_FOUND") {
        console.log("Waiting for transaction confirmation...");
        getResponse = await server.getTransaction(sendResponse.hash);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);

      if (getResponse.status === "SUCCESS") {
        let returnValue = getResponse.returnValue;
        console.log(`Transaction result: ${returnValue.value()}`);
        if (!returnValue.value()) {
          return false;
        }
      } else {
        throw `Transaction failed: ${getResponse.resultXdr}`;
      }
    } else {
      throw sendResponse.errorResultXdr;
    }
  } catch (error) {
    console.error("Error checking user registration:", error);
  }
};

async function updateUser(caller, wallet, diamonds, nfts, xp, kills) {
  let walletScVal = accountToScVal(wallet);
  let diamondsScVal = numberToU64(diamonds);
  let nftsScVal = vecToScValVec(nfts);
  let xpScVal = numberToU64(xp);
  let killsScVal = numberToU64(kills);
  let values = [walletScVal, diamondsScVal, nftsScVal, xpScVal, killsScVal];

  try {
    await contractInt(caller, "update_user", values);
    console.log(`User with wallet ${wallet} updated successfully`);
  } catch (error) {
    console.log("User update failed", error);
  }
}

async function getUserNFTs(caller, wallet) {
  let walletScVal = accountToScVal(wallet);

  try {
    let result = await contractInt(caller, "get_user_nfts", walletScVal);
    return result;
  } catch (error) {
    console.log("Failed to get user NFTs", error);
  }
}

async function getLeaderboard(caller) {
  try {
    let result = await contractInt(caller, "get_leaderboard", null);
    return result;
  } catch (error) {
    console.log("Failed to get leaderboard", error);
  }
}

export {
  registerUser,
  isUserRegistered,
  updateUser,
  getUserNFTs,
  contractInt,
  getLeaderboard,
};
