import { FlowLines } from "./components/FlowLines";
import { WordSection } from "./components/WordSection";
import { SiatoHeader } from "./components/SiatoHeader";
import { SiatoCustomers } from "./components/SiatoCustomers";
import { SiatoModules } from "./components/SiatoModules";
import { SiatoDevices } from "./components/SiatoDevices";
import { SiatoFeatures } from "./components/SiatoFeatures";
import { SiatoVoices } from "./components/SiatoVoices";
import { SiatoWhy } from "./components/SiatoWhy";
import { SiatoPricing } from "./components/SiatoPricing";
import { SiatoFaq } from "./components/SiatoFaq";
import { SiatoContact, SiatoFooter } from "./components/SiatoContact";

function App() {
  return (
    <main className="relative font-sans antialiased">
      <FlowLines />
      <SiatoHeader />
      <WordSection word="fliessen" />
      <SiatoCustomers />
      <SiatoModules />
      <WordSection word="überall" />
      <SiatoDevices />
      <SiatoFeatures />
      <SiatoVoices />
      <WordSection word="besser" />
      <SiatoWhy />
      <WordSection word="fair" />
      <SiatoPricing />
      <SiatoFaq />
      <SiatoContact />
      <SiatoFooter />
    </main>
  );
}

export default App;
