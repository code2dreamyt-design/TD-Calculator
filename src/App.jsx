import { Route, Routes } from "react-router-dom"
import TdCalculator from "./pages/TdCalculator"
import History from "./components/History"
import ExportOpt from "./components/ExportOpt"
import DataForm from "./pages/DataForm"
import ResultPage from "./pages/ResultPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/calculator" element={<TdCalculator/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/exports" element={<ExportOpt/>}/>
        <Route path="*" element={<DataForm/>} />
        <Route path="/details" element={<DataForm/>} />
        <Route path="/results" element={<ResultPage/>}/>
      </Routes>
    </>
  )
}

export default App
