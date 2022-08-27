import NavBar from "../components/Header";
import Hero from "../components/Hero";
import MainMint from "../components/Minting"
import FAQ from "../components/Faq";

export default function Home() {
  return (
    <div className='overlay'>
      <div className="App">
      <NavBar />
      <Hero />
      <MainMint />
      <FAQ />
      </div>
      <div className='moving-background'>
      </div>
    </div>
  );
}
