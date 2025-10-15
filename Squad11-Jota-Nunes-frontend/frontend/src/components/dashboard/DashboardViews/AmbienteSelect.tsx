import React from 'react';
import { areas } from '../../../data/mockData';

interface AmbienteSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ambientesDisponiveis: string[]; // <- adicionamos essa prop
  className?: string;
}

export const AmbienteSelect: React.FC<AmbienteSelectProps> = ({
  value,
  onChange,
  ambientesDisponiveis,
  className = 'form-control'
}) => {
  // Filtra apenas os ambientes que existem neste projeto
  const ambientesPrivativos = areas['Un. Privativas'].filter(a => ambientesDisponiveis.includes(a));
  const ambientesComuns = areas['Área Comum'].filter(a => ambientesDisponiveis.includes(a));

  return (
    <select value={value} onChange={onChange} className={className}>

      {ambientesPrivativos.length > 0 && (
        <optgroup label="Un. Privativas">
          {ambientesPrivativos.map(ambiente => (
            <option key={ambiente} value={ambiente}>
              {ambiente}
            </option>
          ))}
        </optgroup>
      )}

      {ambientesComuns.length > 0 && (
        <optgroup label="Área Comum">
          {ambientesComuns.map(ambiente => (
            <option key={ambiente} value={ambiente}>
              {ambiente}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
};