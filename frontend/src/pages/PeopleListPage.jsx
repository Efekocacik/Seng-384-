import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

function PeopleListPage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editErrors, setEditErrors] = useState([]);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function loadPeople() {
    setLoading(true);
    setFetchError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/people`);
      setPeople(response.data);
    } catch (err) {
      setFetchError("Kişi listesi yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPeople();
  }, []);

  function startEdit(person) {
    setEditId(person.id);
    setEditFullName(person.full_name);
    setEditEmail(person.email);
    setEditErrors([]);
  }

  function cancelEdit() {
    setEditId(null);
    setEditFullName("");
    setEditEmail("");
    setEditErrors([]);
  }

  function validateEdit() {
    const errs = [];
    if (!editFullName.trim()) {
      errs.push("Ad Soyad zorunludur.");
    }
    if (!editEmail.trim()) {
      errs.push("E-posta zorunludur.");
    } else if (!emailRegex.test(editEmail)) {
      errs.push("E-posta formatı geçersiz.");
    }
    return errs;
  }

  async function saveEdit(id) {
    const errs = validateEdit();
    if (errs.length > 0) {
      setEditErrors(errs);
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/people/${id}`, {
        full_name: editFullName,
        email: editEmail
      });

      const updated = response.data;
      setPeople((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      cancelEdit();
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.errors) {
          setEditErrors(data.errors);
        } else if (status === 409) {
          setEditErrors([data.message || "Bu e-posta zaten kayıtlı."]);
        } else {
          setEditErrors([data.message || "Güncelleme sırasında hata oluştu."]);
        }
      } else {
        setEditErrors(["Sunucuya ulaşılamıyor."]);
      }
    }
  }

  function askDelete(id) {
    setDeleteId(id);
  }

  function cancelDelete() {
    setDeleteId(null);
    setDeleteConfirmLoading(false);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleteConfirmLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/people/${deleteId}`);
      setPeople((prev) => prev.filter((p) => p.id !== deleteId));
      cancelDelete();
    } catch (err) {
      alert("Silme işlemi sırasında hata oluştu.");
      cancelDelete();
    }
  }

  return (
    <section className="card">
      <h1>Kişi Listesi</h1>
      <p className="subtitle">
        Sistemde kayıtlı olan kişileri görüntüleyebilir, bilgilerini güncelleyebilir veya silebilirsiniz.
      </p>

      {loading && <p>Yükleniyor...</p>}

      {fetchError && !loading && (
        <div className="alert alert-error">{fetchError}</div>
      )}

      {!loading && people.length === 0 && !fetchError && (
        <p>Henüz kayıtlı kişi bulunmuyor.</p>
      )}

      {!loading && people.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th style={{ width: "180px" }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>
                    {editId === person.id ? (
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                      />
                    ) : (
                      person.full_name
                    )}
                  </td>
                  <td>
                    {editId === person.id ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      person.email
                    )}
                  </td>
                  <td>
                    {editId === person.id ? (
                      <div className="actions">
                        <button
                          className="btn-primary btn-sm"
                          type="button"
                          onClick={() => saveEdit(person.id)}
                        >
                          Kaydet
                        </button>
                        <button
                          className="btn-secondary btn-sm"
                          type="button"
                          onClick={cancelEdit}
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <div className="actions">
                        <button
                          className="btn-secondary btn-sm"
                          type="button"
                          onClick={() => startEdit(person)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          type="button"
                          onClick={() => askDelete(person.id)}
                        >
                          Sil
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editId && editErrors.length > 0 && (
            <div className="alert alert-error mt-2">
              <ul>
                {editErrors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Silme Onayı</h2>
            <p>Bu kişiyi silmek istediğinize emin misiniz?</p>
            <div className="modal-actions">
              <button
                className="btn-danger"
                type="button"
                onClick={confirmDelete}
                disabled={deleteConfirmLoading}
              >
                {deleteConfirmLoading ? "Siliniyor..." : "Evet, Sil"}
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={cancelDelete}
                disabled={deleteConfirmLoading}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PeopleListPage;

