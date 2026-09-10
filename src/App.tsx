import { FlowLines } from "./components/FlowLines";
import { Splash } from "./components/Splash";
import { WordSection } from "./components/WordSection";
import { SiatoNav } from "./components/SiatoNav";
import { SiatoHeader } from "./components/SiatoHeader";
import { SiatoCustomers } from "./components/SiatoCustomers";
import { SiatoGruende } from "./components/SiatoGruende";
import { SiatoModules } from "./components/SiatoModules";
import { SiatoDevices } from "./components/SiatoDevices";
import { SiatoFeatures } from "./components/SiatoFeatures";
import { SiatoVoices } from "./components/SiatoVoices";
import { SiatoWhy } from "./components/SiatoWhy";
import { SiatoPricing } from "./components/SiatoPricing";
import { SiatoFaq } from "./components/SiatoFaq";
import { SiatoContact, SiatoFooter } from "./components/SiatoContact";
import { SiatoNachOben } from "./components/SiatoNachOben";

function App() {
  return (
    <main className="relative font-sans antialiased">
      <Splash />
      <FlowLines />
      <SiatoNav />
      <SiatoHeader />
      <WordSection word="fliessen" />
      <SiatoWhy />
      <SiatoGruende />
      <WordSection word="besser" />
      <SiatoModules />
      <WordSection word="überall" />
      <SiatoDevices />
      <SiatoFeatures />
      <SiatoCustomers />
      <SiatoVoices />
      <WordSection word="fair" />
      <SiatoPricing />
      <SiatoFaq />
      <SiatoContact />
      <SiatoNachOben />
      <SiatoFooter />
    </main>
  );
}

export default App;
