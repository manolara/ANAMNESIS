export const createRotaryKnob = ({
  pedal,
  name,
  label,
  min = 0,
  max = 1,
  step = 0.01,
  value = 0,
  onInput,
  subPedal,
}) => {
  const type =
    pedal.dataset.type + subPedal
      ? Math.random().toString(36).substr(2, 9)
      : '';
  const wrapper = document.createElement('li');

  wrapper.innerHTML = `<label for="${type}_${name}">${label}</label>
  <input type="range" id="${type}_${name}" name="${name}" min="${min}" max="${max}" value="${value}" step="${step}" />
  <button type="button" class="pedal__knob" style="--percentage: 10"></button>`;

  const knob = wrapper.querySelector('button');

  if (onInput) {
    const input = wrapper.querySelector('input');
    setKnob(knob, min, max, value);

    input.addEventListener('input', (event) => {
      onInput(event);
      setKnob(knob, min, max, event.target.value);
    });

    let engaged = false;
    let prevY = null;

    const engage = (event) => {
      engaged = true;
      let prevY = event.clientY;
      event.preventDefault();
    };

    const disengage = (event) => {
      engaged = false;
    };

    const rotaryMove = (Y) => {
      if (engaged) {
        if (prevY - Y === 0) {
          return;
        }

        const goingUp = prevY >= Y;
        prevY = Y;
        let diff = min < 0 ? min / -50 : max / 50;
        diff = diff < step ? step : diff;
        input.value = Number(input.value) + diff * (goingUp ? 1 : -1);

        input.dispatchEvent(
          new Event('input', {
            bubbles: true,
            cancelable: true,
          })
        );
      }
    };

    knob.addEventListener('mousedown', engage);
    window.addEventListener('mouseup', disengage);
    knob.addEventListener('touchstart', engage);
    window.addEventListener('touchend', disengage);

    // Add touch support
    window.addEventListener('mousemove', (event) => {
      rotaryMove(event.clientY);
    });

    window.addEventListener('touchmove', (event) => {
      rotaryMove(event.touches[0].clientY);
    });
  }

  const $list = subPedal || pedal.querySelector('.pedal__controls');
  if ($list) {
    $list.appendChild(wrapper);
  }

  return knob;
};
