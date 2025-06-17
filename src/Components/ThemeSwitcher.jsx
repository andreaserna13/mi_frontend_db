// src/Components/ThemeSwitcher.jsx
import React from 'react';

const ThemeSwitcher = ({ onChangeTheme }) => {
  return (
    <div>
      <button onClick={onChangeTheme}>Cambiar tema</button>
    </div>
  );
};

export default ThemeSwitcher;

