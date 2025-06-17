import { useState } from 'react';
import './App.css';

function Conversor() {
  const [TextoaVoz, setTextoaVoz] = useState('');
  const [VozaTexto, setVozaTexto] = useState('');

  function cambiarTexto(evento) {
    setTextoaVoz(evento.target.value);
  }

  function convertirTextoaVoz() {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(TextoaVoz);
    synth.speak(utterThis);
  }

  function resultado(event) {
    setVozaTexto(event.results[0][0].transcript);
  }

  function GrabarVozaTexto() {
    if (!window.webkitSpeechRecognition) {
      alert('Este navegador no soporta la grabación de voz.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.start();
    recognition.onresult = resultado;
  }

  return (
    <>
      <h1>Conversor TTS Y STT</h1>
      <br />
      <h3>Conversor de Texto a Voz</h3>
      <input
        type="text"
        id="TextoaVoz"
        value={TextoaVoz}
        onChange={cambiarTexto}
        placeholder="Escribe tu texto aquí"
      />
      <button onClick={convertirTextoaVoz}>Convertir</button>

      <h3>Conversor de Voz a Texto</h3>
      <button onClick={GrabarVozaTexto}>Grabar</button>

      <h4>Resultado de Voz a Texto:</h4>
      <input
        type="text"
        value={VozaTexto}
        onChange={(e) => setVozaTexto(e.target.value)}
        placeholder="El texto de tu voz aparecerá aquí"
      />

      {/* Agregar el botón de "Volver" o "Regresar" */}
      <button className="back-button">
        &#8592; Volver
      </button>
    </>
  );
}

export default Conversor;


