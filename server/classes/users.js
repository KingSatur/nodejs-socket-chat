class Users {
  constructor() {
    this.users = [];
  }

  addPerson(id, name, room) {
    let person = {
      id,
      name,
      room,
    };

    this.users.push(person);
    return this.users;
  }

  getPerson(id) {
    let person = this.users.filter((m) => {
      return m.id === id;
    })[0];

    return person;
  }

  getPersons() {
    return this.users;
  }

  getPersonsByRoom(room) {
    let personInRoom = this.users.filter((m) => {
      return m.room === room;
    });
    return personInRoom;
  }

  removePerson(id) {
    let removedPerson = this.getPerson(id);

    this.users = this.users.filter((m) => {
      return m.id !== id;
    });

    return removedPerson;
  }
}

module.exports = {
  Users,
};
