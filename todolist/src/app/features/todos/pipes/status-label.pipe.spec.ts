import { StatusLabelPipe } from './status-label.pipe';

describe('StatusLabelPipe', () => {
  it('maps status to labels', () => {
    const p = new StatusLabelPipe();
    expect(p.transform('todo')).toBe('To do');
    expect(p.transform('doing')).toBe('In progress');
    expect(p.transform('done')).toBe('Done');
  });
});
