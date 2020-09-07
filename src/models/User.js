export default class User {
  constructor(id, name, address, cellNo, expoToken, balance) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.cellNo = cellNo;
    this.expoToken = expoToken;
    this.balance = balance;
  }
  getUser (){
      return { id: this.id, name: this.name, address: this.address, cellNo: this.cellNo, expoToken: this.expoToken, balance: this.balance };
  }
//   get id() {
//     return this.id;
//   }
//   set id(id) {
//     this.id = id;
//   }
//   get name() {
//     return this.name;
//   }
//   set name(name) {
//     this.name = name;
//   }
//   get address() {
//     return this.address;
//   }
//   set address(address) {
//     this.address = address;
//   }
//   get cellNo() {
//     return this.cellNo;
//   }
//   set cellNo(cellNo) {
//     this.cellNo = cellNo;
//   }
//   get expoToken() {
//     return this.expoToken;
//   }
//   set expoToken(expoToken) {
//     this.expoToken = expoToken;
//   }
//   get balance() {
//     return this.balance;
//   }
//   set balance(balance) {
//     this.balance = balance;
//   }
}
