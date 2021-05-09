import { add ,mul } from '../add'
var assert = require('assert')
describe('add', function() {
    it('1+2 should be 3', function() {
      assert.equal(add(1,2), 3);
    });
    it('-2 * 5 should be -10',function(){
      assert.equal(mul(-2,5),-10)
    })

});