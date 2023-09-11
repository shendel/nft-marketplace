import type { NextPage } from "next"
import { useRouter } from "next/router"

import styles from "/styles/market.js"
import Header from "/components/market/Header"
import Footer from "/components/market/Footer"

import useStorage from "../storage/"
import { useEffect, useState } from "react"


const SellPage: NextPage = (props) => {
  const router = useRouter();

  return (
    <>
      <style jsx>
        {styles}
      </style>
      <div>
        <Header />
        <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
          Sell page
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SellPage;
