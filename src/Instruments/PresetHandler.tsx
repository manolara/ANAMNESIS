import * as Tone from 'tone';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import { MonoSynthPresets } from '../Presets/MonoSynthPresets';

interface PresetHandlerProps {
  setPreset: Dispatch<SetStateAction<RecursivePartial<Tone.MonoSynthOptions>>>;
}

export const MonoSynthPresetHandler = ({ setPreset }: PresetHandlerProps) => {
  const defaultPreset = 'Default';

  const presetsInMenu = Object.keys(MonoSynthPresets).map((presetName, i) => (
    <MenuItem sx={{ fontSize: '0.8rem' }} key={i} value={presetName}>
      {presetName}
    </MenuItem>
  ));

  return (
    <FormControl size="small">
      <InputLabel sx={{ fontSize: '0.8rem' }}>Presets</InputLabel>
      <Select
        sx={{
          minWidth: 80,
          fontSize: '0.7rem',
          maxHeight: '2rem',
          '& .MuiSelect-input': { fontSize: '0.7rem' },
        }}
        label="Preset"
        defaultValue={defaultPreset}
        onChange={(e) => {
          setPreset(MonoSynthPresets[e.target.value]);
        }}
      >
        {presetsInMenu}
      </Select>
    </FormControl>
  );
};
