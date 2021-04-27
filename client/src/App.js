import React, { Component } from "react";
import StarNotaryContract from "./contracts/StarNotary.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StarNotaryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        StarNotaryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts });
      this.starNotaryContract = instance;
      this.getTokenInfo();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getTokenInfo = async () => {
    const tokenName = await this.starNotaryContract.methods.name().call();
    const tokenSymbol = await this.starNotaryContract.methods.symbol().call();
    this.setState({ tokenName, tokenSymbol });
  }

  makeStateFieldChange = (fieldName) => ({ target: { value }}) => this.setState({ [fieldName]: value });

  handleCreateStar = async (e) => {
    e.preventDefault();
    const { accounts, starName, starId } = this.state;
    const { createStar } = this.starNotaryContract.methods;
    const numbericId = parseInt(starId);
    if (starName.trim().length > 0 && !isNaN(numbericId)) {
      const name = starName.trim();
      await createStar(name, numbericId).send({ from: accounts[0], gas: 3000000 });
      this.setState({ starName: '', starId: '' });
    }
  }

  lookUp = async (e) => {
    e.preventDefault();
    const { searchToken } = this.state;
    const { lookUptokenIdToStarInfo } = this.starNotaryContract.methods;
    const tokenId = parseInt(searchToken);
    if (isNaN(tokenId)) {
      return this.setState({ lookUpError: 'Enter a valid token Id' });
    };
    try {
      const name = await lookUptokenIdToStarInfo(tokenId).call();
      if (name.length) {
        this.setState({ foundStarName: name, lookUpError: '', searchToken: '' });
      } else {
        this.setState({ foundStarName: '', lookUpError: 'No available Token' });
      }
    } catch(e) {
      this.setState({ foundStarName: '', lookUpError: 'No available Token' });
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const { starName, starId, searchToken, foundStarName, lookUpError, tokenName, tokenSymbol } = this.state;
    return (
      <div className="container mx-auto">
        <h1 className="text-6xl my-12 font-semibold">CryptoStar</h1>
        <h1 className="text-3xl font-semibold">{tokenName} | {tokenSymbol}</h1>
        <div className="flex flex-row justify-between my-16">
          <div className="w-4/6 rounded-3xl bg-red-400 h-96 p-12">
            <form onSubmit={this.handleCreateStar}>
              <h2 className="text-3xl font-medium">Add a star</h2>
              <input type="text"
                className="rounded my-4 w-3/6 h-12 p-4"
                onChange={this.makeStateFieldChange('starName')}
                value={starName} 
                placeholder="Star Name"
              />
              <br />
              <input
                type="text"
                className="rounded my-2 w-1/6 h-12 p-4"
                onChange={this.makeStateFieldChange('starId')}
                value={starId}
                placeholder="Star ID"
              />
              <br />
              <button
                type="submit"
                className="h-12 bg-green-300 rounded my-5 px-12 text-lg"
              >Create</button>
            </form>
          </div>
          <div className="flex-grow h-96 rounded-3xl bg-green-400 h-96 p-12 mx-4">
            <h2 className="text-3xl font-medium">Find A Star</h2>
            <form onSubmit={this.lookUp}>
              <input
                type="text"
                className="rounded my-2 w-18 h-12 p-4"
                onChange={this.makeStateFieldChange('searchToken')}
                value={searchToken}
                placeholder="Star ID"
              />
              <button
                type="submit"
                  className="h-12 bg-red-500 rounded m-5 px-12 text-lg"
              >Find</button>
            </form>
            <div>
              { foundStarName && (
                <>
                  <b>Found Star: </b>
                  <span>{foundStarName}</span>
                </>
              )}
              { lookUpError && (
                <>
                  <b>{lookUpError}</b>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
