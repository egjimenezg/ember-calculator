import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | operation-solver', function(hooks) {
  setupTest(hooks);

  test('should execute consecutive sum and subtraction', function(assert){
    let service = this.owner.lookup('service:operation-solver');
     
    service.setLeftOperandAndOperator(Number(10),'+');
    assert.strictEqual(service.calculateAndSetNewOperator('10','+'), '20');
    assert.strictEqual(service.calculateAndSetNewOperator('20','+'), '40');
    assert.strictEqual(service.calculateAndSetNewOperator('50','+'), '90');
    
    service.cleanOperation();
      
    service.setLeftOperandAndOperator(Number(10),'+');

    assert.strictEqual(service.calculateAndSetNewOperator('10','-'), '20');
    assert.strictEqual(service.calculateAndSetNewOperator('5', '-'), '15');
    assert.strictEqual(service.getResult('5'), '10');
  });

  test('should execute consecutive sum, subtraction, multiplication and division', function(assert){
    let service = this.owner.lookup('service:operation-solver');

    service.setLeftOperandAndOperator(Number(10), '+');
    assert.strictEqual(service.calculateAndSetNewOperator('10', '+'), '20');
    assert.strictEqual(service.calculateAndSetNewOperator('10','*'), '30');
    assert.strictEqual(service.calculateAndSetNewOperator('5','/'), '150');
    assert.strictEqual(service.getResult('50'), '3');
  });

  test('should execute consecutive sum, subtraction, multiplication and division with negative and decimal numbers', function(assert){
    let service = this.owner.lookup('service:operation-solver');

    service.setLeftOperandAndOperator(Number(-200.25), '+');
    assert.strictEqual(service.calculateAndSetNewOperator('.25', '*'), '-200');
    assert.strictEqual(service.calculateAndSetNewOperator('5','/'), '-1000');
    assert.strictEqual(service.calculateAndSetNewOperator('10','-'), '-100');
    assert.strictEqual(service.calculateAndSetNewOperator('20','/'), '-120');
    assert.strictEqual(service.calculateAndSetNewOperator('20','*'), '-6');
    assert.strictEqual(service.getResult('999.963'), '-5999.778');
  });


  test('should fail executing a division by zero', function(assert){
    let service = this.owner.lookup('service:operation-solver');
    service.setLeftOperandAndOperator(Number(50), '/');
    assert.strictEqual(service.getResult('0'), 'Error: Division by 0');
  });

  test('should validate operators', function(assert){
    let service = this.owner.lookup('service:operation-solver');
    assert.strictEqual(service.isOperandValid('100'), true);
    assert.strictEqual(service.isOperandValid('100e10'), true);
    assert.strictEqual(service.isOperandValid('100e-10'), true);
    assert.strictEqual(service.isOperandValid('100e+10'), true);
    assert.strictEqual(service.isOperandValid('-5e10'), true);
    assert.strictEqual(service.isOperandValid('9.1234e+0'),true);
    assert.strictEqual(service.isOperandValid('100e'), false);
    assert.strictEqual(service.isOperandValid('-.e20'), false);
    assert.strictEqual(service.isOperandValid('100e-'), false);
    assert.strictEqual(service.isOperandValid('100e+'), false);
  });

  test('should fail assigning an invalid number or operator', function(assert){
    let service = this.owner.lookup('service:operation-solver');
    assert.strictEqual(service.isInputValid('',''), false);
    assert.strictEqual(service.isInputValid('abc',''), false);
    assert.strictEqual(service.isInputValid('+*.0230ab','.'), false);
    assert.strictEqual(service.isInputValid('.','+'), false);
    assert.strictEqual(service.isInputValid('-.','+'), false);
    assert.strictEqual(service.isInputValid('-.','-'), false);
    assert.strictEqual(service.isInputValid('0....9','.'), false);
    assert.strictEqual(service.isInputValid('000009','x'), false);
    assert.strictEqual(service.isInputValid('--99.5','*'), false);
    assert.strictEqual(service.isInputValid('-.5','*'), true);
    assert.strictEqual(service.isInputValid('-100.5','+'), true);
    assert.strictEqual(service.isInputValid('0.','*'), true);
    assert.strictEqual(service.isInputValid('000009','+'), true);
    assert.strictEqual(service.isInputValid('0.00000','+'), true);
    assert.strictEqual(service.isInputValid('5','+'), true);
    assert.strictEqual(service.isInputValid('6','-'), true);
    assert.strictEqual(service.isInputValid('999999','-'), true);
    assert.strictEqual(service.isInputValid('110.50','*'),true);
    assert.strictEqual(service.isInputValid('0.000','+'), true);
  });

  test('should fix the result when the value is greater than MAX_SAFE_INTEGER or less than MIN_SAFE_INTEGER', function(assert){
    let service = this.owner.lookup('service:operation-solver');
    assert.strictEqual(service.setResultLimits(Number.MAX_SAFE_INTEGER+1),Number.MAX_SAFE_INTEGER.toPrecision(15));
    assert.strictEqual(service.setResultLimits(1e16+5), "1.00000000000000e+16");
    assert.strictEqual(service.setResultLimits(1e14+5), "100000000000005");
  });

});
