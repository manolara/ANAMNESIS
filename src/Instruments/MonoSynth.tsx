import {
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';
import { useMemo, useRef, useEffect, useState } from 'react';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import { Icon } from '@iconify/react';
import waveSine from '@iconify/icons-ph/wave-sine';
import waveSquare from '@iconify/icons-ph/wave-square';
import waveTriangle from '@iconify/icons-ph/wave-triangle';
import waveSawtooth from '@iconify/icons-ph/wave-sawtooth';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { synthLFO } from './SynthLFO';
import { SoundSourceProps } from '../types/componentProps';
import axios, { all } from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { v4 as uuidv4 } from 'uuid';

import {
  MonoSynthPresets,
  MonoSynthPresetsType,
  MonoSynthPresetType,
} from '../Presets/MonoSynthPresets';
import { MonoSynthPresetHandler } from './PresetHandler';
import SaveIcon from '@mui/icons-material/Save';

const serverURL = 'http://localhost:3000/monosynth';

const defaultSynthOptions: RecursivePartial<Tone.MonoSynthOptions> = {
  oscillator: {
    type: 'sawtooth',
  },
  envelope: {
    attack: 0.001,
    decay: 1,
    sustain: 0.5,
    release: 1,
  },

  filterEnvelope: {
    attack: 0.001,
    decay: 0.7,
    sustain: 0.5,
    release: 1,
    octaves: 4,
  },
};

const HPF_ENVELOPE: Partial<Tone.FrequencyEnvelopeOptions> = {
  attack: 0.001,
  decay: 1,
  sustain: 0,
  release: 0,
  octaves: 3,
};

export const MonoSynth = ({
  soundEngine,
  output,
}: SoundSourceProps<Tone.MonoSynth>) => {
  const [allMonoPresets, setAllMonoPresets] =
    useState<MonoSynthPresetsType>(MonoSynthPresets);

  const [presetOptionAnchorEl, setPresetOptionAnchorEl] =
    useState<null | HTMLElement>(null);
  const openPresetOptions = Boolean(presetOptionAnchorEl);

  const [preset, setPreset] = useState(MonoSynthPresets.Default);

  const updateLocalPresets = async () => {
    const res = await axios.get(`${serverURL}/get`);
    const data = res.data;
    const newPresets: MonoSynthPresetsType = {};
    data.forEach((preset: MonoSynthPresetType) => {
      newPresets[preset.name] = preset;
    });
    if (newPresets) {
      setAllMonoPresets(newPresets);
    }
  };

  useEffect(() => {
    updateLocalPresets();
  }, []);

  console.log(preset);

  const outLevel = useMemo(() => new Tone.Gain(), []);
  const HPF = useMemo(() => new Tone.Filter(20, 'highpass'), []);
  const HPFEnvelope = useMemo(
    () => new Tone.FrequencyEnvelope(HPF_ENVELOPE),
    []
  ).connect(HPF.frequency);

  const mono = useMemo(() => soundEngine.set(defaultSynthOptions), []);
  console.log(allMonoPresets, 'all presets');

  //setup stuff
  const LFO = useRef(new synthLFO()).current;
  useEffect(() => {
    mono.chain(HPF, outLevel, output);

    return () => {
      mono.dispose();
      outLevel.dispose();
      HPFEnvelope.dispose();
      HPF.dispose();
      LFO.disconnect();
    };
  }, []);

  useEffect(() => {
    mono.set(preset);
  }, [preset]);

  const savePreset = () => {
    const presetName = prompt('Enter preset name');
    if (presetName) {
      const newPreset: MonoSynthPresetType = {
        name: presetName,
        userPreset: true,
        envelope: {
          attack: mono.envelope.attack,
          decay: mono.envelope.decay,
          sustain: mono.envelope.sustain,
          release: mono.envelope.release,
        },
        filterEnvelope: {
          attack: mono.filterEnvelope.attack,
          decay: mono.filterEnvelope.decay,
          sustain: mono.filterEnvelope.sustain,
          release: mono.filterEnvelope.release,
          baseFrequency: mono.filterEnvelope.baseFrequency,
        },
        oscillator: {
          type: mono.oscillator.type as NonCustomOscillatorType,
        },
      };
      const newMonoSynthPresets = {
        ...allMonoPresets,
        [presetName]: newPreset,
      };
      MonoSynthPresets[presetName] = newPreset;
      axios.post(`${serverURL}/create`, newPreset).then((res) => {
        setAllMonoPresets(newMonoSynthPresets);
        updateLocalPresets();
        console.log(res.data._id, 'res');
        setPreset({ ...newPreset, _id: res.data._id });
      });
    }
  };

  const postDefaultPresets = () => {
    const presets = Object.values(MonoSynthPresets);
    presets.forEach((preset) => {
      axios.post(`${serverURL}/create`, preset).then((res) => {
        console.log(res, 'res');
      });
    });
  };

  const loadAllPresets = () => {
    axios.get(`${serverURL}/get`).then((res) => {
      console.log(res, 'res');
    });
  };

  const deletePresetById = (id: string) => {
    axios.delete(`${serverURL}/delete/${id}`).then((res) => {
      console.log(res, 'res');
      updateLocalPresets();
      setPreset(allMonoPresets.Default);
    });
  };

  const deleteAllUserPresets = () => {
    axios.delete(`${serverURL}/deleteAll`).then((res) => {
      console.log(res, 'res');
      updateLocalPresets();
      setPreset(allMonoPresets.Default);
    });
  };
  const renamePresetById = (id: string) => {
    const newName = prompt('Enter new name');
    const newPresets = { ...allMonoPresets, [newName!]: preset };

    axios.patch(`${serverURL}/rename/${id}`, { name: newName }).then((res) => {
      console.log(res, 'res');

      setPreset({ ...preset, name: newName! });
      updateLocalPresets();
    });
  };

  const handlePresetOptionOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPresetOptionAnchorEl(event.currentTarget);
  };
  const handlePresetOptionClose = () => {
    setPresetOptionAnchorEl(null);
  };

  return (
    <>
      <button onClick={deleteAllUserPresets}>del all</button>
      <AButton
        onClick={() => {
          mono.triggerAttackRelease('C4', '4n');
        }}
      ></AButton>
      <Stack
        spacing={1}
        direction="row"
        className="unselectable"
        sx={{
          backgroundColor: APalette.purple,
          width: 'fit-content',
          p: 1,
        }}
      >
        <Stack justifyContent={'space-between'}></Stack>
        <Stack>
          <Stack spacing={3} direction="row">
            <Typography
              sx={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
            >
              MONO
            </Typography>
            <Knob
              title="LFO"
              onValueChange={(value) => {
                LFO.updateLFO(value);
              }}
            />
            <Knob
              title="HPF"
              min={20}
              max={20000}
              defaultValue={20}
              isExp
              onValueChange={(value) => {
                HPFEnvelope.baseFrequency = value;
                console.log(HPF.frequency.value, 'HPF cutoff');
                LFO.updateLFO();
              }}
            />
            <Knob
              title="Cut-off"
              defaultValue={preset.filterEnvelope?.baseFrequency as number}
              min={20}
              max={20000}
              isExp
              onValueChange={(value) => {
                mono.filterEnvelope.baseFrequency = value;
                LFO.updateLFO();
              }}
            />
            <Knob
              title="Level"
              onValueChange={(value) => {
                outLevel.gain.value = value / 100;
                LFO.updateLFO();
              }}
            />
          </Stack>
          <Stack spacing={3} direction="row">
            <Knob
              title="Attack"
              isExp
              hasDecimals={3}
              min={0.001}
              defaultValue={preset.envelope?.attack as number}
              max={10}
              onValueChange={(value) => {
                mono.set({
                  envelope: { attack: value },
                });
                mono.filterEnvelope.attack = value;
              }}
            />
            <Knob
              title="Decay"
              isExp
              hasDecimals={3}
              min={0.1}
              defaultValue={preset.envelope?.decay as number}
              max={10}
              onValueChange={(value) => {
                mono.set({
                  envelope: { decay: value },
                });
                mono.filterEnvelope.decay = value;
              }}
            />
            <Knob
              title="Sustain"
              defaultValue={(preset.envelope?.sustain as number) * 100}
              onValueChange={(value) => {
                mono.set({
                  envelope: { sustain: value / 100 },
                });
                mono.filterEnvelope.set({ sustain: value / 100 });
              }}
            />
            <Knob
              title="Release"
              isExp
              hasDecimals={3}
              min={0.1}
              defaultValue={preset.envelope?.release as number}
              max={20}
              onValueChange={(value) => {
                mono.set({
                  envelope: { release: value },
                });
                mono.filterEnvelope.release = value;
                console.log(mono.filterEnvelope.release, 'release');
              }}
            />
          </Stack>
          <Stack
            pt={1.5}
            justifyContent="space-between"
            alignItems="center"
            direction={'row'}
          >
            <FormControl size="small">
              <InputLabel sx={{ fontSize: '0.8rem' }}>OSC</InputLabel>
              <Select
                sx={{ maxHeight: '2rem' }}
                label="OSC"
                defaultValue={'sawtooth'}
                onChange={(e) =>
                  mono.set({
                    oscillator: {
                      type: e.target.value as NonCustomOscillatorType,
                    },
                  })
                }
              >
                <MenuItem value={'sine'}>
                  <Icon icon={waveSine} />
                </MenuItem>

                <MenuItem value={'triangle'}>
                  <Icon icon={waveTriangle} />
                </MenuItem>
                <MenuItem value={'sawtooth'}>
                  <Icon icon={waveSawtooth} />
                </MenuItem>
                <MenuItem value={'square'}>
                  <Icon icon={waveSquare} />
                </MenuItem>
              </Select>
            </FormControl>

            <Stack
              p="0"
              justifyContent={'center'}
              alignItems="center"
              direction="row"
            >
              <MonoSynthPresetHandler
                monoSynthPresets={allMonoPresets}
                preset={preset.name}
                setPreset={setPreset}
              />
              {/* remove hover background */}
              <IconButton sx={{ height: '100%' }} onClick={savePreset}>
                <SaveIcon sx={{ transform: 'scale(1.2)', pl: '0' }} />
              </IconButton>
              {preset.userPreset ? (
                <IconButton onClick={handlePresetOptionOpen} sx={{ p: '0' }}>
                  <MoreVertIcon />
                </IconButton>
              ) : null}
              <Menu
                open={openPresetOptions}
                anchorEl={presetOptionAnchorEl}
                onClose={handlePresetOptionClose}
              >
                <MenuItem
                  onClick={() => {
                    renamePresetById(preset._id!);
                    handlePresetOptionClose();
                  }}
                >
                  Rename Preset
                </MenuItem>
                <MenuItem
                  sx={{ color: 'red' }}
                  onClick={() => {
                    deletePresetById(preset._id!);
                    handlePresetOptionClose();
                  }}
                >
                  Delete Preset
                </MenuItem>
              </Menu>
            </Stack>

            <FormControl size="small">
              <InputLabel
                sx={{
                  fontSize: '0.7rem',
                }}
              >
                LFO
              </InputLabel>
              <Select
                sx={{
                  minWidth: 80,
                  fontSize: '0.7rem',
                  maxHeight: '2rem',
                  '& .MuiSelect-input': { fontSize: '0.7rem' },
                }}
                autoWidth
                label="LFO"
                defaultValue={'none'}
                onChange={(e) => {
                  if (e.target.value === 'level') {
                    LFO.assignTo(outLevel);
                  }
                  if (e.target.value === 'Cut-Off') {
                    LFO.assignTo(mono.filter, mono.filterEnvelope);
                  }
                  if (e.target.value === 'HPF') {
                    LFO.assignTo(HPF, HPFEnvelope);
                  }
                  if (e.target.value === 'none') {
                    LFO.disconnect();
                  }
                }}
              >
                <MenuItem sx={{ fontSize: '0.8rem' }} value={'level'}>
                  Level
                </MenuItem>
                <MenuItem sx={{ fontSize: '0.8rem' }} value={'Cut-Off'}>
                  Cut-Off
                </MenuItem>
                <MenuItem sx={{ fontSize: '0.8rem' }} value={'HPF'}>
                  HPF
                </MenuItem>
                <MenuItem sx={{ fontSize: '0.8rem' }} value={'none'}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
