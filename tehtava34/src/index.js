import React from "react";
import ReactDOM from "react-dom";
import personService from "./services/persons";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newNumber: "",
      filter: "",
      notification: null
    };
  }

  componentWillMount() {
    personService.getAll().then((persons) => this.setState({persons}));
  }

  nollaaViesti = () => {
    setTimeout(() => {
      this.setState({notification: null});
    }, 4000);
  };

  addPersonToDatabase = (personObject, message) => {
    personService.create(personObject).then((newPerson) => {
      this.setState({
        persons: this.state.persons.concat(newPerson),
        notification: message
      });
      this.nollaaViesti();
    });
  };

  addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: this.state.newName,
      number: this.state.newNumber
    };

    if (this.personIsUnique()) {
      const message = `${personObject.name} lisätty onnistuneesti.`;
      this.addPersonToDatabase(personObject, message);
    } else {
      const existingPerson = this.state.persons.find(
        (person) =>
          person.name.toLowerCase() === this.state.newName.toLowerCase()
      );

      const updatedPersonObject = {
        name: existingPerson.name,
        number: this.state.newNumber
      };

      personService
        .update(existingPerson.id, updatedPersonObject)
        .then((updatedPerson) => {
          const personsWithoutUpdated = this.state.persons.filter(
            (person) => person.id !== updatedPerson.id
          );
          this.setState({
            persons: personsWithoutUpdated.concat(updatedPerson),
            notification: `Puhelinnumero päivitetty onnistuneesti.`
          });
          this.nollaaViesti();
        })
        .catch((error) => {
          personService.getAll().then((persons) => this.setState({persons}));
          const message = `Henkilöä ${
            personObject.name
          } ei löytynyt. Lisätty puhelinluetteloon.`;
          this.addPersonToDatabase(personObject, message);
        });
    }

    this.setState({
      newName: "",
      newNumber: ""
    });
  };

  deletePerson = (id) => {
    return () => {
      const poistettava = this.state.persons.find((person) => person.id === id);
      if (window.confirm(`Poistetaanko ${poistettava.name}?`)) {
        personService.remove(id).then((response) => {
          const newPersons = this.state.persons.filter(
            (person) => person.id !== id
          );
          this.setState({
            persons: newPersons,
            notification: `${poistettava.name} poistettu onnistuneesti.`
          });
        });
        this.nollaaViesti();
      }
    };
  };

  personIsUnique = () =>
    this.state.persons.filter(
      (person) => person.name.toLowerCase() === this.state.newName.toLowerCase()
    ).length === 0;

  filterList = () =>
    this.state.persons.filter((person) =>
      person.name.toLowerCase().includes(this.state.filter.toLowerCase())
    );

  handlePersonChange = (e) => {
    this.setState({newName: e.target.value});
  };

  handleNumberChange = (e) => {
    this.setState({newNumber: e.target.value});
  };

  handleSearchChange = (e) => {
    this.setState({filter: e.target.value});
  };

  render() {
    return (
      <div>
        <Notification message={this.state.notification} />
        <h2>Puhelinluettelo</h2>
        <Rajaus
          filter={this.state.filter}
          handleChange={this.handleSearchChange}
        />
        <h3>Lisää uusi</h3>
        <form onSubmit={this.addPerson}>
          <div>
            nimi:{" "}
            <input
              value={this.state.newName}
              onChange={this.handlePersonChange}
            />
            <br />
            numero:{" "}
            <input
              value={this.state.newNumber}
              onChange={this.handleNumberChange}
            />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <h3>Numerot</h3>
        <Numerot persons={this.filterList()} handleClick={this.deletePerson} />
      </div>
    );
  }
}

const Rajaus = ({filter, handleChange}) => {
  return (
    <div>
      <div>
        rajaa näytettäviä <input value={filter} onChange={handleChange} />
      </div>
    </div>
  );
};

const Numerot = ({persons, handleClick}) => {
  const byId = (person1, person2) => person1.id - person2.id;
  return (
    <table>
      <tbody>
        {persons
          .sort(byId)
          .map((person) => (
            <Person
              key={person.id}
              person={person.name}
              number={person.number}
              id={person.id}
              handleClick={handleClick}
            />
          ))}
      </tbody>
    </table>
  );
};

const Person = ({person, number, id, handleClick}) => {
  return (
    <tr>
      <td>{person}</td>
      <td>{number}</td>
      <td>
        <button onClick={handleClick(id)}>poista</button>
      </td>
    </tr>
  );
};

const Notification = ({message}) => {
  if (message === null) {
    return null;
  }
  return <div className="notification">{message}</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
