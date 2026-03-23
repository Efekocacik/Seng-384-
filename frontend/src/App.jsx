import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import RegistrationForm from "./pages/RegistrationForm";
import PeopleListPage from "./pages/PeopleListPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <nav className="nav">
            <h1 className="logo">Person Management System</h1>
            <ul className="nav-links">
              <li>
                <NavLink to="/" end>Kayıt Formu</NavLink>
              </li>
              <li>
                <NavLink to="/people">Kişi Listesi</NavLink>
              </li>
            </ul>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/people" element={<PeopleListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

