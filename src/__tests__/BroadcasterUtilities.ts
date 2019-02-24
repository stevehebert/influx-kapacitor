import { BroadcasterUtilities } from '../broadcasters/BroadcasterUtilities';

describe('', () => {
  it('combines strings into a single linefeed delimited string', () => {
    const output = BroadcasterUtilities.combine_lines(['a', 'b', 'c']);
    expect(output).toBe('a\nb\nc');
  });
});
