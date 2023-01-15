import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  submitComplaint,
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [time, setTime] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await submitComplaint(url, name, description, address, number, time);
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setAddress("");
      setNumber("");
      setTime("");
      setURL("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Police Complaint System</h1>
      <p>
        Add the following details and then press "Submit."
      </p>
      <form>
        <h2>Name: </h2>
        <input
          type="text"
          placeholder="Name of the complainant."
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Description: </h2>
        <input
          type="text"
          placeholder="Description of the incident."
          onChange={(event) => setDescription(event.target.value)}
        />
        <h2>Address: </h2>
        <input
          type="text"
          placeholder="Address of the complainant."
          onChange={(event) => setAddress(event.target.value)}
        />
        <h2>Number: </h2>
        <input
          type="text"
          placeholder="Number of the complainant."
          onChange={(event) => setNumber(event.target.value)}
        />
        <h2>Time: </h2>
        <input
          type="text"
          placeholder="Time of the incident."
          onChange={(event) => setTime(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Submit Complaint
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
