import { useState } from "react";
import axios from "axios";
import "./style.scss";
import { Formik, Form, Field } from "formik";
import Loader from "./components/Loader";
import * as Yup from "yup";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Bitte gib einen Namen an."),
    hobby: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Bitte gib ein Hobby an."),
    age: Yup.number("Muss eine Zahl sein.").required("Bitte gib das Alter an."),
  });

  async function handleSubmit(values) {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const request = await axios.post(`.netlify/functions/gedicht`, values);
      setResult(request.data);
    } catch (error) {
      setError("Irgendwas hat da nicht geklappt :-(");
    }

    setLoading(false);
  }
  return (
    <div className="App">
      <div className="inner">
        <h1>
          Magnus <br />
          <span className="green">Geburtstagsgedichtgenerator</span>
        </h1>
        <div className="inner-grid">
          <div className="form-wrap">
            <h2>Eingabe</h2>

            <Formik
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              initialValues={{ name: "", age: "", hobby: "" }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="field-wrap">
                    <label htmlFor="name">Vorname</label>
                    <Field name="name" className="name" id="name" />
                    {errors.name && touched.name ? (
                      <div className="field-error">{errors.name}</div>
                    ) : null}
                  </div>
                  <div className="field-wrap">
                    <label htmlFor="age">Alter</label>
                    <Field type="number" name="age" className="age" id="age" />
                    {errors.age && touched.age ? (
                      <div className="field-error">{errors.age}</div>
                    ) : null}
                  </div>
                  <div className="field-wrap">
                    <label htmlFor="hobby">Hobbys</label>
                    <Field name="hobby" className="hobby" id="hobby" />
                    {errors.hobby && touched.hobby ? (
                      <div className="field-error">{errors.hobby}</div>
                    ) : null}
                  </div>
                  {!loading && <button type="submit">Generieren</button>}
                </Form>
              )}
            </Formik>
          </div>
          <div className="result-wrap">
            <h2>Ergebnis</h2>
            {!loading && result && <div className="result">{result}</div>}
            {loading && <Loader />}
            {error && <div className="error">{error}</div>}
          </div>
        </div>
        <div className="explain">
          <h3>Was passiert hier?</h3>
          <p>
            Im ersten Schritt werden die 3 Formularfelder an eine kleine
            Serverfunktion gesendet. Diese baut aus den 3 Informationen
            folgenden Satz:
            <p>
              <i>
                Formuliere ein Geburtstagsgedicht. Der Vorname der Person ist
                %NAME%, sie ist %ALTER% Jahre alt geworden und hat die Hobbys
                %HOBBY%. Das Gedicht soll aus zwei Absätzen mit jeweils 4 Zeilen
                bestehen.
              </i>
            </p>
            <p>
              Dieser Satz wird über die API-Schnittstelle an Chat GTP übergeben,
              zusammen mit anderen Informationen wie die Auswahl des Modells.
            </p>
            <p>
              Zurück kommt das formulierte Ergebnis und kann im Frontend
              dargestellt werden.
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
