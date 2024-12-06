import React, { useContext } from 'react';
import { UserContext } from '../App';

const Transaction_List = () => {
  const { accessToken, transactions, error, createLinkToken } = React.useContext(UserContext);
  console.log({transactions})
  return (
    <div className="App">
    <h1> Plaid Transaction Viewer </h1>

    <table>
        <thead>
        <tr>
            <th>Transaction Name</th>
            <th>Transaction Amount</th>
            <th>Transaction Date </th>
        </tr>
        </thead>
        <tbody>
            {transactions.length > 0 ? (transactions.map((transaction, index) => (
                <tr key={index}>
                <td>{transaction.name}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.date}</td>
              </tr>
            ))
        ) : (
            <tr>
                <td colSpan="3">No Transactions Found</td>
            </tr>
        )
    }
        </tbody>
    </table>
  </div>
  )
}

export default Transaction_List