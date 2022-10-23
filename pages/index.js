import Head from 'next/head';
//import HeaderManual from '../components/HeaderManual';
import Header from '../components/Header';
import LotteryEntrance from '../components/LotteryEntrance';

export default function Home() {
   return (
      <div>
         <Head>
            <title>Web3 Raffle</title>
            <meta name="description" content="Smart Contrac Lottery" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <header>
            {/* <HeaderManual /> */}
            <Header />
         </header>
         <LotteryEntrance />
      </div>
   );
}
