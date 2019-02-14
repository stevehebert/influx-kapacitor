// src/_tests__/HttpInfluxBroadcaster.test.ts

import { HttpInfluxBroadcaster } from '../HttpInfluxBroadcaster';

describe('HttpInfluxCapacitor', () => {
  it('combines strings into a single linefeed delimited string', () => {
    const output = HttpInfluxBroadcaster.combine_lines(["a", "b", "c"]);
    expect(output).toEqual('a\nb\nc');
  });
});