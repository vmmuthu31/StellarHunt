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
import { Buffer } from "buffer";

import { userSignTransaction } from "./Freighter";

let rpcUrl = "https://soroban-testnet.stellar.org";

let contractAddress =
  "CAW62A7V5ZXWR4GKXEYVZNDUWHPBRP4G4QZYPZAJE2SRMA3OQC2D73QS";

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

const vecToScValVec = (vec) => {
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
      .setTimeout(20)
      .build();
  } else if (Array.isArray(values)) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, ...values))
      .setTimeout(20)
      .build();
  } else {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, values))
      .setTimeout(20)
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
    const result = await contractInt(caller, "register_user", values);
    console.log(
      `User ${username} with wallet ${wallet} registered successfully`
    );
    return result;
  } catch (error) {
    console.log("User registration failed", error);
    throw error;
  }
}

const isUserRegistered = async (wallet) => {
  try {
    const server = new SorobanRpc.Server(rpcUrl);
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
    const contract = new Contract(contractAddress);

    let builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("is_user_registered", accountToScVal(wallet)))
      .setTimeout(20)
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
        return returnValue.value();
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

async function gameStart(caller, wallet) {
  let walletScVal = accountToScVal(wallet);

  try {
    await contractInt(caller, "game_start", walletScVal);
    console.log(`Game started for user with wallet ${wallet}`);
  } catch (error) {
    console.log("Failed to start game", error);
  }
}

async function gameEnd(caller, wallet, tokensAwarded) {
  let walletScVal = accountToScVal(wallet);
  let tokensAwardedScVal = nativeToScVal(tokensAwarded);

  try {
    await contractInt(caller, "game_end", [walletScVal, tokensAwardedScVal]);
    console.log(`Game ended for user with wallet ${wallet}`);
  } catch (error) {
    console.log("Failed to end game", error);
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

async function getUserData(wallet) {
  try {
    const server = new SorobanRpc.Server(rpcUrl);
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
    const contract = new Contract(contractAddress);

    // Build and sign the transaction
    let builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("get_user_data", accountToScVal(wallet)))
      .setTimeout(20)
      .build();

    let preparedTransaction = await server.prepareTransaction(builtTransaction);
    preparedTransaction.sign(sourceKeypair);

    // Send the transaction
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
        let returnValue = parseUserData(getResponse.returnValue);
        console.log(`Transaction result: ${returnValue}`);
        console.log(`Transaction result: ${JSON.stringify(returnValue)}`);

        // Log the actual returnValue structure for debugging
        console.log("returnValue structure:", JSON.stringify(returnValue));

        return returnValue;
      } else {
        throw `Transaction failed: ${getResponse.resultXdr}`;
      }
    } else {
      throw sendResponse.errorResultXdr;
    }
  } catch (error) {
    console.error("Error checking user registration:", error);
  }
}

function parseUserData(result) {
  if (!result || result._switch.name !== "scvMap") {
    throw new Error("Invalid user structure");
  }

  let userData = {};
  console.log("Parsing result:", JSON.stringify(result));

  for (let entry of result._value) {
    let key = entry._attributes.key._value.toString();
    let value = entry._attributes.val;
    console.log("Key:", key, "Value:", JSON.stringify(value));

    switch (key) {
      case "nfts":
        userData.nfts = value._value
          ? value._value.map((nft) => ({
              image_url: nft._attributes.image_url
                ? nft._attributes.image_url._value
                : null,
              hash: nft._attributes.hash ? nft._attributes.hash._value : null,
              name: nft._attributes.name ? nft._attributes.name._value : null,
            }))
          : [];
        break;
      case "user":
        if (value._switch.name === "scvMap") {
          let userAttributes = {};
          for (let userEntry of value._value) {
            let userKey = userEntry._attributes.key._value.toString();
            let userVal = userEntry._attributes.val;
            switch (userKey) {
              case "diamonds":
                userAttributes.diamonds = userVal._value || 0;
                break;
              case "xp":
                userAttributes.xp = userVal._value || 0;
                break;
              case "matches":
                userAttributes.matches = userVal._value || 0;
                break;
              case "kills":
                userAttributes.kills = userVal._value || 0;
                break;
              case "tokens":
                if (userVal._switch.name === "scvI128" && userVal._attributes) {
                  let hi = userVal._attributes.hi
                    ? userVal._attributes.hi._value
                    : 0;
                  let lo = userVal._attributes.lo
                    ? userVal._attributes.lo._value
                    : 0;
                  userAttributes.tokens = (BigInt(hi) << 64n) + BigInt(lo);
                } else {
                  userAttributes.tokens = "200"; // Initial tokens value
                }
                break;
              default:
                break;
            }
          }
          userData.user = userAttributes;
        }
        break;
      case "username":
        userData.username = value._value ? value._value.toString() : "";
        break;
      default:
        break;
    }
  }
  return userData;
}

export {
  registerUser,
  isUserRegistered,
  updateUser,
  gameStart,
  gameEnd,
  getUserNFTs,
  contractInt,
  getLeaderboard,
  getUserData,
};
