class RevenueCourtForm {
  constructor(town, documentNumber, bahiNumber, volume, registerDate) {
    this.town = town;
    this.documentNumber = documentNumber;
    this.bahiNumber = bahiNumber;
    this.volume = volume;
    this.registerDate = registerDate;
  }
  getTown = () => {
      return this.town;
  }
}
