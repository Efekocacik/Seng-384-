import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Kayıt Formu</Link>
            </li>
            <li>
              <Link to="/people">Kişi Listesi</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<div>Form burada olacak</div>} />
          <Route path="/people" element={<div>Liste burada olacak</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

