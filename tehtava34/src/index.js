import React from "react";
import ReactDOM from "react-dom";
import personService from "./services/persons";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newNumber: "",
      filter: ""
    };
  }

  componentWillMount() {
    personService.getAll().then((persons) => {
      this.setState({persons});
    });
  }

  addPerson = (e) => {
    e.preventDefault();

    if (this.checkPersonIsUnique()) {
      const personObject = {
        name: this.state.newName,
        number: this.state.newNumber
      };
      personService.create(personObject).then((newPerson) => {
        this.setState({
          persons: this.state.persons.concat(newPerson)
        });
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
            persons: newPersons
          });
        });
      }
    };
  };

  checkPersonIsUnique = () =>
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
  return (
    <table>
      <tbody>
        {persons.map((person) => (
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

ReactDOM.render(<App />, document.getElementById("root"));
