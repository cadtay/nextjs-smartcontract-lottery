import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '../constants';
import { ethers } from 'ethers';
import { useNotification } from 'web3uikit';

const LotteryEntrance = () => {
   const [entranceFee, setEntranceFee] = useState('0');
   const [numOfPlayers, setNumOfPlayers] = useState('0');
   const [recentWinner, setRecentWinner] = useState('0');
   const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
   const chainId = parseInt(chainIdHex);
   const raffleAddress =
      chainId in contractAddresses ? contractAddresses[chainId][0] : null;

   const dispatch = useNotification();

   const {
      runContractFunction: enterRaffle,
      isLoading,
      isFetching,
   } = useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: 'enterRaffle',
      params: {},
      msgValue: entranceFee,
   });

   const { runContractFunction: getEntranceFee } = useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: 'getEntranceFee',
   });

   const { runContractFunction: getNumPlayers } = useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: 'getNumPlayers',
   });

   const { runContractFunction: getRecentWinner } = useWeb3Contract({
      abi: abi,
      contractAddress: raffleAddress,
      functionName: 'getRecentWinner',
   });

   useEffect(() => {
      if (isWeb3Enabled) {
         updateUI();
      }
   }, [isWeb3Enabled]);

   const updateUI = async () => {
      const entranceFee = (await getEntranceFee()).toString();
      setEntranceFee(entranceFee);

      const players = (await getNumPlayers()).toString();
      setNumOfPlayers(players);

      const recentWinner = (await getRecentWinner()).toString();
      setRecentWinner(recentWinner);
   };

   const handleSuccess = async (tx) => {
      await tx.wait(1);
      handleNewNotification(tx);
      updateUI();
   };

   const handleNewNotification = () => {
      dispatch({
         type: 'info',
         message: 'Transaction Complete',
         title: 'Tx Notification',
         position: 'topR',
         icon: 'bell',
      });
   };

   return (
      <div>
         {raffleAddress && account ? (
            <div>
               <button
                  onClick={async () => {
                     await enterRaffle({
                        onSuccess: handleSuccess,
                        onError: (error) => console.log(error),
                     });
                  }}
                  disabled={isLoading || isFetching}
               >
                  Enter Raffle
               </button>
               <div>
                  Entrance Fee {ethers.utils.formatUnits(entranceFee, 'ether')}{' '}
                  ETH
               </div>
               <div>Number of Players: {numOfPlayers}</div>
               <div>Recent Winner: {recentWinner}</div>
            </div>
         ) : (
            <div>No Raffle Address Detected or Wallet Not Connected</div>
         )}
      </div>
   );
};

export default LotteryEntrance;
