import {
  firstCell,
  lastCell,
  convertHeightToLeadNotes,
  findTranPoints,
} from './Doodler_utils';

describe('firstCell', () => {
  it('should return the index of the first cell that the line intersects', () => {
    expect(firstCell([50])).toEqual(0);
    expect(firstCell([100])).toEqual(1);
    expect(firstCell([150])).toEqual(1);
    expect(firstCell([200])).toEqual(2);
  });

  it('should return -1 if the input array is empty', () => {
    expect(firstCell([])).toEqual(-1);
  });
});

describe('lastCell', () => {
  it('should return the index of the last cell that the line intersects', () => {
    expect(lastCell([50])).toEqual(0);
    expect(lastCell([100])).toEqual(1);
    expect(lastCell([150])).toEqual(1);
    expect(lastCell([200])).toEqual(2);
  });

  it('should return -1 if the input array is empty', () => {
    expect(lastCell([])).toEqual(-1);
  });
});

describe('convertHeightToLeadNotes', () => {
  it('should convert a cell number to a lead sheet note', () => {
    expect(convertHeightToLeadNotes(12)).toEqual('C4');
    expect(convertHeightToLeadNotes(11)).toEqual('D4');
    expect(convertHeightToLeadNotes(10)).toEqual('E4');
    expect(convertHeightToLeadNotes(9)).toEqual('G4');
    expect(convertHeightToLeadNotes(8)).toEqual('A4');
    expect(convertHeightToLeadNotes(7)).toEqual('B4');
    expect(convertHeightToLeadNotes(6)).toEqual('C5');
    expect(convertHeightToLeadNotes(5)).toEqual('D5');
    expect(convertHeightToLeadNotes(4)).toEqual('E5');
    expect(convertHeightToLeadNotes(3)).toEqual('G5');
    expect(convertHeightToLeadNotes(2)).toEqual('A5');
    expect(convertHeightToLeadNotes(1)).toEqual('B5');
  });
});

describe('findTranPoints', () => {
  it('should find the transition points for a line', () => {
    expect(findTranPoints([50, 100, 101, 150, 200])).toEqual([0, 1, 3, 4]);
    expect(findTranPoints([0, 75, 150, 225])).toEqual([0, 1, 2, 3]);
    expect(findTranPoints([0, 1, 2, 3, 4, 100, 150])).toEqual([0, 5, 6]);
    expect(findTranPoints([50, 100, 150, 199])).toEqual([0, 1, 2, 3]);
  });
});
