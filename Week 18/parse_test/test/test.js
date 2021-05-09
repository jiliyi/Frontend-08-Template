import  parseHTML from '../src/parser.js';
const assert = require('assert');

describe('parseHTML', function() {
    it('<a src="www.baidu.com"></a>', function() { 
      assert.equal(parseHTML('<a src="www.baidu.com"></a>').children.length, 1);
    });

    it(`<a src="www.baidu.com" id='demo'></a>`, function() { 
        assert.equal(parseHTML(`<a src="www.baidu.com" id='demo'></a>`).children.length, 1);
      });
     

      it(`<img  />`, function() { 
        assert.equal(parseHTML(`<img />`).children.length, 1);
      });
     

      it(`<img a=aaa />`, function() { 
        assert.equal(parseHTML(`<img a=aaa />`).children.length, 1);
      });
      

      it(`<img a=aaa/>`, function() { 
        assert.equal(parseHTML(`<img a=aaa/>`).children.length, 1);
      });
      
      it(`< >`, function() { 
        assert.equal(parseHTML(`< >`).children[0].type, 'text');
      });
      console.log(parseHTML(`< >`))

      it(`<a href id></a>`, function() { 
        assert.equal(parseHTML(`<a href id></a>`).children.length, 1);
      });
     
      it(`<a id=aaa></a>`, function() { 
        assert.equal(parseHTML(`<a id=aaa></a>`).children.length, 1);
      });
      console.log(parseHTML(`<a id=aaa></a>`))
});