const expect = require('chai').expect
const server = require('./app');

describe('test', () => {
  it('should return a string', () => {
    expect('welcome to node scheduler').to.equal('welcome to node scheduler');
  });
});
