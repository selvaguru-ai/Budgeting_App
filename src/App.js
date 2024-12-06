import logo from './logo.svg';
import './App.css';
import React, {useState, createContext} from 'react';
import axios from 'axios';
import Transaction_List from './Components/Transaction_List';

export const UserContext = React.createContext();

function App() {
  const [publicToken, setPublicToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  console.log('trying to create link token')
  // Create a link token
  const createLinkToken = async() =>{
    try{
      const response = await axios.post ("http://127.0.0.1:8000/api/create_link_token");
      const linkToken = response.data.link_token;
      console.log("Link Token is ",response);

      //Plaid Link setup
      const handler = window.Plaid.create({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
          setPublicToken(public_token);
          await setAccessTokenFromPublicToken(public_token);
          await setAccessTokenFromPublicToken(public_token);
        },
        onExit: (err, metadata) => {
          if (err){
            setError(err.error_message);
          }
        }
      });
      handler.open();
    } catch(err) {
      setError('Error creating link token');
    }
  };

  // Get Access Token from Public Token
  const setAccessTokenFromPublicToken = async (publicToken) => {
    try {
      // Create FormData and append the public_token as form data
      const formData = new FormData();
      formData.append('public_token', publicToken);

      const response = await axios.post('http://127.0.0.1:8000/api/set_access_token', formData);
      setAccessToken(response.data.access_token);
      fetchTransactions(response.data.access_token);
    }catch (err){
      setError('Error exchanging public token for access token');
    }
  };

  //Fetch Transactions
  const fetchTransactions = async (accessToken) => {
    try {
      const response = await axios.get(' http://127.0.0.1:8000/api/transactions', {
        params: {access_token: accessToken}
      });
      setTransactions(response.data.latest_transactions);
    }catch (err){
      setError('Error fetching Transactions');
    }
  };

  return (

    <UserContext.Provider value = {{accessToken, transactions, error, createLinkToken}}>
      <Transaction_List />
    </UserContext.Provider>
  );
}

export default App;
