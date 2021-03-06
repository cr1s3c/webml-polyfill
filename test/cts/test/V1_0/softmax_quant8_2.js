// Generated file (from: softmax_quant8_2.mod.py). Do not edit
describe('CTS', function() {
  const assert = chai.assert;
  const nn = navigator.ml.getNeuralNetworkContext();

  it('check result for Softmax quant8 example/2', async function() {
    // For 'Softmax quant8' example: examples
    let model = await nn.createModel(options);
    let operandIndex = 0;

    let input_value = [1, 2, 3, 4, 5, 255, 254, 253, 252, 251];
    let output_expect = [15, 24, 40, 67, 110, 110, 67, 40, 24, 15];

    let type0 = {type: nn.TENSOR_QUANT8_ASYMM, dimensions: [2, 5], scale: 0.5, zeroPoint: 0};
    let type0_length = product(type0.dimensions);
    let type1 = {type: nn.FLOAT32};
    let type2 = {type: nn.TENSOR_QUANT8_ASYMM, dimensions: [2, 5], scale: 0.00390625, zeroPoint: 0};
    let type2_length = product(type2.dimensions);

    let input = operandIndex++;
    model.addOperand(type0);
    let beta = operandIndex++;
    model.addOperand(type1);
    let output = operandIndex++;
    model.addOperand(type2);

    model.setOperandValue(beta, new Float32Array([1.0]));
    model.addOperation(nn.SOFTMAX, [input, beta], [output]);

    model.identifyInputsAndOutputs([input], [output]);
    await model.finish();

    let compilation = await model.createCompilation();
    compilation.setPreference(getPreferenceCode(options.prefer));
    await compilation.finish();

    let execution = await compilation.createExecution();

    let input_input = new Uint8Array(input_value);
    execution.setInput(0, input_input);
    let output_output = new Uint8Array(type2_length);
    execution.setOutput(0, output_output);

    await execution.startCompute();

    for (let i = 0; i < type2_length; ++i) {
      assert.isTrue(almostEqualCTS(output_output[i], output_expect[i]));
    }
  });
});
