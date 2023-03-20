import {
  FormControl,
  Icon,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import {
  MonoSynthPresetsType,
  MonoSynthPresetType,
} from '../Presets/MonoSynthPresets';
import DeleteIcon from '@mui/icons-material/Delete';
interface PresetHandlerProps {
  monoSynthPresets: MonoSynthPresetsType;
  setPreset: Dispatch<SetStateAction<MonoSynthPresetType>>;
  preset: string;
}

export const MonoSynthPresetHandler = ({
  monoSynthPresets,
  setPreset,
  preset,
}: PresetHandlerProps) => {
  const defaultPreset = 'Default';
  console.log('rendering preset handler', monoSynthPresets);

  const presetsInMenu = Object.keys(monoSynthPresets).map((presetName, i) => (
    //add adornment

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
        value={preset}
        defaultValue={defaultPreset}
        onChange={(e) => {
          setPreset(monoSynthPresets[e.target.value]);
        }}
      >
        {presetsInMenu}
      </Select>
    </FormControl>
  );
};
