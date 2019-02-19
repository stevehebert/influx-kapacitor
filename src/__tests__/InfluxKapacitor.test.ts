import { InfluxKapacitor } from '../InfluxKapacitor';
import { InfluxKapacitorWriter } from '../InfluxKapacitorWriter';


describe('InfluxKapacitor', () => {
  it('communicates over the exit callback', () => {
    let value = 0;
    
    InfluxKapacitor.setExitCallback(() => {
      value += 1;
    });

    InfluxKapacitor.exitCaller();

    expect(value).toBe(1);
  });

  it('properly clears the exit callback', () => {
    let value = 0;

    InfluxKapacitor.setExitCallback(() => {
      value += 1;
    });

    InfluxKapacitor.exitCaller();
    InfluxKapacitor.exitCaller();

    InfluxKapacitor.setExitCallback(null);

    InfluxKapacitor.exitCaller();
    expect(value).toBe(2);
  })
});