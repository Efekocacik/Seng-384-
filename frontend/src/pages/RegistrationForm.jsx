import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function RegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const validationErrors = [];

    if (!fullName.trim()) {
      validationErrors.push("Ad Soyad zorunludur.");
    }

    if (!email.trim()) {
      validationErrors.push("E-posta zorunludur.");
    } else if (!emailRegex.test(email)) {
      validationErrors.push("E-posta formatı geçersiz.");
    }

    return validationErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/people`, {
        full_name: fullName,
        email
      });

      if (response.status === 201) {
        setSuccessMessage("Kayıt başarıyla oluşturuldu.");
        setFullName("");
        setEmail("");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.errors) {
          setErrors(data.errors);
        } else if (status === 409) {
          setErrors([data.message || "Bu e-posta zaten kayıtlı."]);
        } else {
          setErrors([data.message || "Beklenmeyen bir hata oluştu."]);
        }
      } else {
        setErrors(["Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin."]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card">
      <h1>Kişi Kayıt Formu</h1>
      <p className="subtitle">
        Yeni bir kişiyi sisteme eklemek için formu doldurun.
      </p>

      {errors.length > 0 && (
        <div className="alert alert-error">
          <ul>
            {errors.map((errMsg, idx) => (
              <li key={idx}>{errMsg}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="fullName">Ad Soyad</label>
          <input
            id="fullName"
            type="text"
            placeholder="Örn: Ali Veli"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            id="email"
            type="email"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </section>
  );
}

export default RegistrationForm;

